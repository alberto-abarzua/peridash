import datetime

from django.test import TestCase
from django.core.cache import cache as site_cache
from ticker.api_utils import TwelveDataCore
from ticker.models import Symbol


class TickerModels(TestCase):
    def setUp(self):
        # clear the cache
        site_cache.clear()
        self.stock_client = TwelveDataCore()
        self.appl = Symbol.objects.create(symbol="AAPL", exchange="NASDAQ")
        self.msft = Symbol.objects.create(symbol="MSFT", exchange="NASDAQ")
        self.usd_clp = Symbol.objects.create(symbol="USD/CLP", exchange="FX")

    def test_search_symbol(self):
        """Test searching for a symbol."""
        symbols = self.stock_client.search_symbol("AAPL")
        self.assertTrue(len(symbols) > 0)
        self.assertEqual(symbols[0]["symbol"], "AAPL")

    def test_query_symbol_data(self):
        datetime_end = datetime.datetime.strptime("2023-05-02", "%Y-%m-%d")
        res = self.stock_client([self.appl, self.msft, self.usd_clp], end=datetime_end)
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
