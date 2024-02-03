# get user model
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

# import APIClient
from rest_framework.test import APIClient, APITestCase

from ticker.models import Ticker, TickerSettings
from ticker.serializers import TickerSerializer


class TickerApiTests(APITestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            name="test_user_name", email="test@me.com", password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.ticker_settings, _ = TickerSettings.objects.get_or_create(user=self.user)

    def test_search_endpoint(self) -> None:
        res = self.client.get(reverse("ticker:search"), {"q": "appl"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) > 5)

    def test_time_series(self) -> None:
        res = self.client.get(
            reverse("ticker:time_series"),
            {
                "symbols": "AAPL:NASDAQ",
                "start": "2023-05-01",
                "end": "2023-05-02",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        first_elem = res.data[0]
        self.assertEqual(first_elem["ticker"]["symbol"]["symbol"], "AAPL")
        self.assertEqual(first_elem["ticker"]["symbol"]["exchange"], "NASDAQ")
        self.assertEqual(first_elem["cur_price"], 168.55)
        self.assertEqual(first_elem["eod_price"], 169.56)
        self.assertEqual(first_elem["price_dif"], -1.009999999999991)
        self.assertEqual(first_elem["price_dif_percent"], -0.5956593536211318)

    def test_time_series_no_date(self) -> None:
        res = self.client.get(
            reverse("ticker:time_series"),
            {
                "symbols": "AAPL:NASDAQ",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        first_elem = res.data[0]
        self.assertEqual(first_elem["ticker"]["symbol"]["symbol"], "AAPL")
        self.assertEqual(first_elem["ticker"]["symbol"]["exchange"], "NASDAQ")
        self.assertTrue("df" in first_elem.keys())
        self.assertEqual(len(first_elem["df"].keys()), 6)

    def test_time_series_user(self) -> None:
        ticker1 = Ticker.create_using_str(symbol="AAPL", exchange="NASDAQ")
        ticker2 = Ticker.create_using_str(symbol="MSFT", exchange="NASDAQ")
        self.ticker_settings.user_tickers.add(ticker1)
        self.ticker_settings.user_tickers.add(ticker2)
        self.ticker_settings.save()

        res = self.client.get(
            reverse("ticker:time_series"),
            {
                "symbols": "__ALL_USER__",
                "start": "2023-05-01",
                "end": "2023-05-02",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) == 2)

    def test_time_series_two_syms(self) -> None:
        self.ticker_settings.save()

        res = self.client.get(
            reverse("ticker:time_series"),
            {
                "symbols": "AAPL:NASDAQ,MSFT:NASDAQ",
                "start": "2023-05-01",
                "end": "2023-05-02",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 2)

    def test_time_series_no_exchange(self) -> None:
        res = self.client.get(
            reverse("ticker:time_series"),
            {
                "symbols": "AAPL",
                "start": "2023-05-01",
                "end": "2023-05-02",
            },
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_user_tickers(self) -> None:
        ticker1 = Ticker.create_using_str(symbol="AAPL", exchange="NASDAQ")
        ticker2 = Ticker.create_using_str(symbol="MSFT", exchange="NASDAQ")

        self.ticker_settings.user_tickers.add(ticker1)
        self.ticker_settings.user_tickers.add(ticker2)
        url = reverse("ticker:user-tickers-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = TickerSerializer([ticker1, ticker2], many=True).data
        self.assertCountEqual(response.data, expected_data)

    def test_add_user_ticker(self) -> None:
        data = {"symbol": "AAPL", "exchange": "NASDAQ"}
        url = reverse("ticker:user-tickers-list")
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Ticker added to user settings.", response.data["detail"])
        self.assertEqual(self.ticker_settings.user_tickers.count(), 1)
        ticker = self.ticker_settings.user_tickers.first()
        self.assertEqual(ticker.symbol.symbol, "AAPL")
        self.assertEqual(ticker.symbol.exchange, "NASDAQ")

    def test_remove_user_ticker(self) -> None:
        ticker = Ticker.create_using_str(symbol="AAPL", exchange="NASDAQ")
        self.ticker_settings.user_tickers.add(ticker)
        url = reverse("ticker:user-tickers-detail", args=[ticker.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIn("Ticker removed from settings.", response.data["detail"])
        self.assertEqual(self.ticker_settings.user_tickers.count(), 0)

    def test_favorite_ticker(self) -> None:
        ticker = Ticker.create_using_str(symbol="AAPL", exchange="NASDAQ")
        self.ticker_settings.user_tickers.add(ticker)
        url = reverse("ticker:user-tickers-detail", args=[ticker.id])
        response = self.client.patch(url, {"is_favorite": True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Ticker updated", response.data["detail"])
        self.assertEqual(self.ticker_settings.user_tickers.count(), 1)
        self.assertTrue(self.ticker_settings.user_tickers.first().is_favorite)

    def test_add_remove_add_user_ticker(self) -> None:
        # add ticker
        data = {"symbol": "AAPL", "exchange": "NASDAQ"}
        url = reverse("ticker:user-tickers-list")
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Ticker added to user settings.", response.data["detail"])
        self.assertEqual(self.ticker_settings.user_tickers.count(), 1)
        ticker = self.ticker_settings.user_tickers.first()
        self.assertEqual(ticker.symbol.symbol, "AAPL")
        self.assertEqual(ticker.symbol.exchange, "NASDAQ")
        # remove ticker
        url = reverse("ticker:user-tickers-detail", args=[ticker.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIn("Ticker removed from settings.", response.data["detail"])
        self.assertEqual(self.ticker_settings.user_tickers.count(), 0)
        # add ticker again
        data = {"symbol": "AAPL", "exchange": "NASDAQ"}
        url = reverse("ticker:user-tickers-list")
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Ticker added to user settings.", response.data["detail"])
        self.assertEqual(self.ticker_settings.user_tickers.count(), 1)
        ticker = self.ticker_settings.user_tickers.first()
        self.assertEqual(ticker.symbol.symbol, "AAPL")
        self.assertEqual(ticker.symbol.exchange, "NASDAQ")

    def test_ticker_user_settings(self) -> None:
        url = reverse("ticker:user-settings")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], self.user.id)
        self.assertEqual(response.data["user_tickers"], [])
        # add a ticker
        ticker = Ticker.create_using_str(symbol="AAPL", exchange="NASDAQ")
        self.ticker_settings.user_tickers.add(ticker)
        self.ticker_settings.save()
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], self.user.id)
        expected_user_tickers = TickerSerializer(self.ticker_settings.user_tickers.all(), many=True).data
        self.assertCountEqual(response.data["user_tickers"], expected_user_tickers)

    def test_ticker_user_settings_update(self) -> None:
        url = reverse("ticker:user-settings")
        data = {
            "plot_range": 20,
            "stats_range": 1,
            "partial": True,
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Settings updated", response.data["detail"])
        self.ticker_settings.refresh_from_db()
        self.assertEqual(self.ticker_settings.plot_range, 20)
        self.assertEqual(self.ticker_settings.stats_range, 1)

    def test_forex_pair(self) -> None:
        data = {"symbol": "USD/CLP", "exchange": "PHYSICALCURRENCY"}
        # add to user
        url = reverse("ticker:user-tickers-list")
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("Ticker added to user settings.", response.data["detail"])
        self.assertEqual(self.ticker_settings.user_tickers.count(), 1)
        # get time series
        url = reverse("ticker:time_series")
        response = self.client.get(
            url,
            {
                "symbols": "__ALL_USER__",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_ticker(self) -> None:
        # modify ticker fields

        ticker = Ticker.create_using_str(symbol="AAPL", exchange="NASDAQ")
        self.ticker_settings.user_tickers.add(ticker)
        self.ticker_settings.save()
        url = reverse("ticker:user-tickers-detail", args=[ticker.id])
        data = {
            "buy": 100,
            "gain": 10,
            "loss": 5,
        }
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Ticker updated", response.data["detail"])
        ticker.refresh_from_db()
        self.assertEqual(ticker.buy, 100)
        self.assertEqual(ticker.gain, 10)
        self.assertEqual(ticker.loss, 5)
