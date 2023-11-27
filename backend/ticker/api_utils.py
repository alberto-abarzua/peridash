import os
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd
import pytz
import requests
from django.core.cache import cache as site_cache
from twelvedata import TDClient

from ticker.models import Symbol, Ticker


class TickerInfo:
    def __init__(self, symbol: Symbol, time_series_dicts: List[Dict[str, Any]]) -> None:
        self.df = self.gen_df(time_series_dicts)
        self.symbol = symbol
        self.cur_price, self.eod_price = self.get_prices()
        self.price_dif = self.cur_price - self.eod_price
        try:
            self.price_dif_percent = (self.price_dif / self.eod_price) * 100
        except ZeroDivisionError:
            self.price_dif_percent = 0
        self.ticker: Optional[Ticker] = None

    def get_prices(self) -> Tuple[float, float]:
        daily_closes = self.df.set_index("datetime")
        daily_closes = daily_closes.resample("D")["close"].last()
        daily_closes = daily_closes.sort_index(ascending=False)
        daily_closes = daily_closes[daily_closes.notna()]
        print(daily_closes)
        try:
            cur_price = float(daily_closes.iloc[0])
        except IndexError:
            cur_price = 0
        try:
            eod_price = float(daily_closes.iloc[min(1, len(daily_closes))])
        except IndexError:
            eod_price = 0
        return cur_price, eod_price

    def gen_df(self, time_series_dicts: List[Dict[str, Any]]) -> pd.DataFrame:
        df = pd.DataFrame(time_series_dicts)
        df["datetime"] = pd.to_datetime(df["datetime"])
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)
        # order dataframe by datetime descending
        df = df.sort_values(by="datetime", ascending=False)
        return df

    def __str__(self) -> str:
        return f"""{self.symbol}
            cur_price {self.cur_price}
            eod: {self.eod_price} dif: {self.price_dif}
            dif%: {self.price_dif_percent}"""


class TwelveDataCore:
    """StockCore for the TwelveData API service."""

    TIME_ZONE = "America/New_York"
    TIME_INTERVAL = "5min"
    PLANS = ["Basic", "Grow"]
    LEVELS = ["Level A"] + PLANS
    EASTERN = pytz.timezone("US/Eastern")
    SEARCH_ENDPOINT = "https://api.twelvedata.com/symbol_search"
    DATE_STR_FORMAT = "%Y-%m-%d %H:%M:%S"
    DAY_RANGE_ALWAYS = 30
    TIME_SERIES_CACHE_INTERVAL = 60
    DATE_FORMATS = ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d")

    def __init__(self) -> None:
        self.api_key = os.environ.get("BACKEND_TWELVE_DATA_API_KEY")
        self.client = TDClient(apikey=self.api_key)

    def check_plan(self, search_result: Dict[str, Any]) -> Dict[str, Any]:
        in_current_plan = False
        try:
            access = search_result["access"]
            search_result["plan"] = access["plan"]
            search_result["global"] = access["global"]
            if search_result["plan"] in self.PLANS or search_result["global"] in self.LEVELS:
                in_current_plan = True
        except KeyError:
            search_result["plan"] = "undefined"
            search_result["global"] = "undefined"
        search_result["in_cur_plan"] = in_current_plan

        return search_result

    def search_symbol(self, pattern: str) -> List[Dict[str, Any]]:
        url = f"{self.SEARCH_ENDPOINT}?symbol={pattern}&show_plan=true"
        response = requests.get(url).json()
        return [self.check_plan(elem) for elem in response["data"]]

    def get_ticker_info(self, symbols: List[Symbol], start: datetime, end: datetime) -> List[TickerInfo]:
        ticker_info_result = []
        if symbols is not None and len(symbols) > 0:
            symbol_dict = {f"{sym.symbol}:{sym.exchange}": sym for sym in symbols}
            time_series = self.client.time_series(
                symbol=list(symbol_dict.keys()),
                interval=self.TIME_INTERVAL,
                outputsize=5000,
                timezone=self.TIME_ZONE,
                start_date=start.strftime(self.DATE_STR_FORMAT),
                end_date=end.strftime(self.DATE_STR_FORMAT),
            ).as_json()

            if type(time_series) is tuple:
                time_series = {f"{symbols[0].symbol}:{symbols[0].exchange}": time_series}

            for symbol, time_series_dicts in time_series.items():
                cur = TickerInfo(symbol_dict[symbol], time_series_dicts)
                ticker_info_result.append(cur)

        return ticker_info_result

    def prev_weekday(self, date: datetime) -> datetime:
        if date.weekday() <= 4:
            return date
        elif date.weekday() == 5:  # If date is a Saturday
            date -= timedelta(days=1)
        elif date.weekday() == 6:  # If date is a Sunday
            date -= timedelta(days=2)
        while date.weekday() > 4:
            date -= timedelta(days=1)
        return date

    def get_start_end(self, end: datetime, days: int) -> Tuple[datetime, datetime]:
        end = end.replace(hour=23, minute=59, second=59)
        start = self.prev_weekday(end) - timedelta(days=days)
        return start, end

    def get_key_time_series(self, symbol: Symbol, start: datetime, end: datetime) -> str:
        safe_symbol = symbol.__str__().replace("/", "_").replace(":", "_").replace(" ", "_")
        return f"TWELVE_SERIES_{safe_symbol}-{start.date()}-{end.date()}"

    def get_eod(self, symbols: List[Symbol]) -> List[Dict[str, Any]]:
        results = []
        for symbol in symbols:
            key = f"{symbol.symbol}:{symbol.exchange}"
            results.append(self.client.eod(symbol=key).as_json())
        return results

    def cache_symbols(self, symbols: List[Symbol], start: datetime, end: datetime) -> List[TickerInfo]:
        not_cached_symbols = []
        for symbol in symbols:
            cache_key = self.get_key_time_series(symbol, start, end)
            cur = site_cache.get(cache_key)
            if cur is None:
                not_cached_symbols.append(symbol)

        not_cached_symbols_chunks = [
            not_cached_symbols[i : i + 10] for i in range(0, len(not_cached_symbols), 10)
        ]

        ticker_info_results: List[TickerInfo] = []

        for symbol_chunk in not_cached_symbols_chunks:
            ticker_info_results += self.get_ticker_info(symbol_chunk, start, end)

        for ticker_info in ticker_info_results:
            cache_key = self.get_key_time_series(ticker_info.symbol, start, end)
            site_cache.set(
                cache_key,
                ticker_info,
                self.TIME_SERIES_CACHE_INTERVAL,
            )

        tickers_from_cache: List[TickerInfo] = []

        for symbol in symbols:
            cur = site_cache.get(self.get_key_time_series(symbol, start, end))
            if cur is not None:
                tickers_from_cache.append(cur)

        return tickers_from_cache

    def __call__(
        self,
        tickers: List[Ticker],
        start: Optional[datetime] = None,
        end: Optional[datetime] = None,
        days: Optional[int] = None,
    ) -> List[TickerInfo]:
        symbols = [ticker.symbol for ticker in tickers]
        if days is None:
            days = self.DAY_RANGE_ALWAYS
        if end is None:
            end = datetime.now()
        if start is None:
            start = end - timedelta(days=days)
        if len(symbols) == 0:
            return []
        start, end = self.get_start_end(end, days)
        res = self.cache_symbols(symbols, start, end)
        for i, ticker in enumerate(tickers):
            res[i].ticker = ticker
        return res
