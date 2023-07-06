import datetime
import os
from datetime import timedelta

import pandas as pd
import pytz
import requests
from django.core.cache import cache as site_cache
from twelvedata import TDClient


class TickerInfo:
    def __init__(self, symbol, time_series_dicts):
        self.df = self.gen_df(time_series_dicts)
        self.symbol = symbol
        self.cur_price, self.eod_price = self.get_prices()
        self.price_dif = self.cur_price - self.eod_price
        self.price_dif_percent = (self.price_dif / self.eod_price) * 100

    def get_prices(self):
        daily_closes = self.df.set_index("datetime")
        daily_closes = daily_closes.resample("D")["close"].last()
        daily_closes = daily_closes.sort_index(ascending=False)
        daily_closes = daily_closes[daily_closes.notna()]
        return daily_closes.iloc[0], daily_closes.iloc[min(1, len(daily_closes))]

    def gen_df(self, time_series_dicts):
        df = pd.DataFrame(time_series_dicts)
        df["datetime"] = pd.to_datetime(df["datetime"])
        df["open"] = df["open"].astype(float)
        df["high"] = df["high"].astype(float)
        df["low"] = df["low"].astype(float)
        df["close"] = df["close"].astype(float)
        # order dataframe by datetime descending
        df = df.sort_values(by="datetime", ascending=False)
        return df

    def __str__(self):
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

    def check_plan(self, elem):
        in_current_plan = False
        try:
            access = elem["access"]
            elem["plan"] = access["plan"]
            elem["global"] = access["global"]
            if elem["plan"] in self.PLANS or elem["global"] in self.LEVELS:
                in_current_plan = True
        except KeyError:
            elem["plan"] = "undefined"
            elem["global"] = "undefined"
        elem["in_cur_plan"] = in_current_plan
        return (in_current_plan, elem)

    def search_symbol(self, pattern):
        url = f"{self.SEARCH_ENDPOINT}?symbol={pattern}&show_plan=true"
        response = requests.get(url).json()
        return [self.check_plan(elem)[1] for elem in response["data"]]

    def get_time_series(self, symbols, start, end):
        if symbols is not None and len(symbols) > 0:
            sym_dict = {f"{sym.symbol}:{sym.exchange}": sym for sym in symbols}
            print(start, end)
            time_series = self.client.time_series(
                symbol=list(sym_dict.keys()),
                interval=self.TIME_INTERVAL,
                outputsize=5000,
                timezone=self.TIME_ZONE,
                start_date=start.strftime(self.DATE_STR_FORMAT),
                end_date=end.strftime(self.DATE_STR_FORMAT),
            ).as_json()
            time_series = (
                {f"{symbols[0].symbol}:{symbols[0].exchange}": time_series}
                if type(time_series) is tuple
                else time_series
            )

            result = []
            for symbol, ts_dicts in time_series.items():
                cur = TickerInfo(sym_dict[symbol], ts_dicts)
                result.append(cur)
            return result
        return []

    def prev_weekday(self, date):
        if date.weekday() <= 4:
            return date
        elif date.weekday() == 5:  # If date is a Saturday
            date -= timedelta(days=1)
        elif date.weekday() == 6:  # If date is a Sunday
            date -= timedelta(days=2)
        while date.weekday() > 4:
            date -= timedelta(days=1)
        return date

    def get_start_end(self, end, days):
        end = end.replace(hour=23, minute=59, second=59)
        start = self.prev_weekday(end) - timedelta(days=days)
        return start, end

    def join(self, dfs, name, num, tp):
        res = []
        for i, elem in enumerate(reversed(dfs)):
            if i == num:
                return res
            res += map(tp, elem[name].tolist())
        return res

    def time_series(self, df, days):
        dates = self.join(df, "datetime", days, str)
        high = self.join(df, "high", days, float)
        res = {
            "x": dates,
            "y": high,
            "ymin": min(high),
            "ymax": max(high),
            "start": dates[-1],
            "end": dates[0],
        }

        return res

    def get_key_time_series(self, symbol, start, end):
        safe_symbol = (
            symbol.__str__().replace("/", "_").replace(":", "_").replace(" ", "_")
        )
        return f"TWELVE_SERIES_{safe_symbol}-{start.date()}-{end.date()}"

    def get_eod(self, symbols):
        results = []
        for symbol in symbols:
            key = f"{symbol.symbol}:{symbol.exchange}"
            results.append(self.client.eod(symbol=key).as_json())
        return results

    def cache_symbols(self, symbols, start, end):
        not_cached_symbols = []
        for sym in symbols:
            cur = site_cache.get(self.get_key_time_series(sym, start, end))
            if cur is None:
                not_cached_symbols.append(sym)
        # split in chunks of 10 symbols'
        print("not_cached_symbols", len(not_cached_symbols))
        not_cached_symbols = [
            not_cached_symbols[i: i + 10]
            for i in range(0, len(not_cached_symbols), 10)
        ]
        time_series = []
        for chunk in not_cached_symbols:
            print("chunk", len(chunk))
            time_series += self.get_time_series(chunk, start, end)

        print("time_series", len(time_series))

        for ts in time_series:
            site_cache.set(
                self.get_key_time_series(ts.symbol, start, end),
                ts,
                self.TIME_SERIES_CACHE_INTERVAL,
            )
        final_tickers = []

        for sym in symbols:
            cur = site_cache.get(self.get_key_time_series(sym, start, end))
            if cur is not None:
                final_tickers.append(cur)
            else:
                print("not found", sym)
        return final_tickers

    def __call__(self, tickers, start=None, end=None, days=None):
        symbols = [ticker.symbol for ticker in tickers]
        if days is None:
            days = self.DAY_RANGE_ALWAYS
        if end is None:
            end = datetime.datetime.now()
        if start is None:
            start = end - datetime.timedelta(days=days)
        if len(symbols) == 0:
            return {}
        start, end = self.get_start_end(end, days)
        res = self.cache_symbols(symbols, start, end)
        for i, ticker in enumerate(tickers):
            res[i].ticker = ticker
        return res
