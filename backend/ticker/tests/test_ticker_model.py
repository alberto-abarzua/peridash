import datetime

# get default user model
from django.contrib.auth import get_user_model
from django.core.cache import cache as site_cache
from django.test import TestCase

from ticker.api_utils import TwelveDataCore
from ticker.models import Symbol, Ticker, TickerSettings


class TickerModels(TestCase):
    def setUp(self) -> None:
        # clear the cache
        site_cache.clear()
        self.stock_client = TwelveDataCore()
        self.appl = Symbol.objects.create(symbol="AAPL", exchange="NASDAQ")
        self.msft = Symbol.objects.create(symbol="MSFT", exchange="NASDAQ")
        self.usd_clp = Symbol.objects.create(symbol="USD/CLP", exchange="FX")

    def test_search_symbol(self) -> None:
        """Test searching for a symbol."""
        symbols = self.stock_client.search_symbol("AAPL")
        self.assertTrue(len(symbols) > 0)
        self.assertEqual(symbols[0]["symbol"], "AAPL")

    def test_query_one_symbol(self) -> None:
        datetime_end = datetime.datetime.strptime("2023-05-02", "%Y-%m-%d")
        symbol_list = [self.appl]
        ticker_list = [
            Ticker.get_or_create_using_str(Ticker.objects.all(), symbol.symbol, symbol.exchange)
            for symbol in symbol_list
        ]
        res = self.stock_client(ticker_list, end=datetime_end)
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0].cur_price, 168.55)
        self.assertEqual(res[0].eod_price, 169.56)
        self.assertEqual(res[0].price_dif, -1.009999999999991)
        self.assertEqual(res[0].price_dif_percent, -0.5956593536211318)

    def test_query_symbol_data(self) -> None:
        datetime_end = datetime.datetime.strptime("2023-05-02", "%Y-%m-%d")
        # symbol list
        symbol_list = [self.appl, self.msft, self.usd_clp]
        ticker_list = [
            Ticker.get_or_create_using_str(Ticker.objects.all(), symbol.symbol, symbol.exchange)
            for symbol in symbol_list
        ]
        res = self.stock_client(ticker_list, end=datetime_end)
        self.assertEqual(len(res), 3)
        self.assertEqual(res[0].symbol, self.appl)
        self.assertEqual(res[1].symbol, self.msft)
        self.assertEqual(res[2].symbol, self.usd_clp)
        """Expected data
        AAPL:NASDAQ
                    cur_price 168.55
                    eod: 169.56 dif: -1.009999999999991
                    dif%: -0.595659353621131
        MSFT:NASDAQ
                    cur_price 305.41
                    eod: 305.54001 dif: -0.1300099999999702
                    dif%: -0.04255089210737742
        USD/CLP:FX
            cur_price 809.82001
            eod: 806.745 dif: 3.0750100000000202
            dif%: 0.38116257305592477
        """
        self.assertEqual(res[0].cur_price, 168.55)
        self.assertEqual(res[0].eod_price, 169.56)
        self.assertEqual(res[0].price_dif, -1.009999999999991)
        self.assertEqual(res[0].price_dif_percent, -0.5956593536211318)

        self.assertEqual(res[1].cur_price, 305.41)
        self.assertEqual(res[1].eod_price, 305.54001)
        self.assertEqual(res[1].price_dif, -0.1300099999999702)
        self.assertEqual(res[1].price_dif_percent, -0.042550892107377426)

        self.assertEqual(res[2].cur_price, 809.82001)
        self.assertEqual(res[2].eod_price, 806.745)
        self.assertEqual(res[2].price_dif, 3.0750100000000202)
        self.assertEqual(res[2].price_dif_percent, 0.38116257305592477)


class TickerSettingsTest(TestCase):
    def setUp(self) -> None:
        self.user = get_user_model().objects.create_user(
            name="test_user_name", email="test@me.com", password="testpass123"
        )

    def test_ticker_settings_creation(self) -> None:
        ticker_settings = TickerSettings.objects.get(user=self.user)
        self.assertTrue(ticker_settings is not None)
        self.assertEqual(ticker_settings.user, self.user)

    def test_ticker_settings_creation_superuser(self) -> None:
        super_user = get_user_model().objects.create_superuser(
            email="test_super_user@me.com", password="testpass123"
        )
        ticker_settings = TickerSettings.objects.get(user=super_user)
        self.assertTrue(ticker_settings is not None)
        self.assertEqual(ticker_settings.user, super_user)
