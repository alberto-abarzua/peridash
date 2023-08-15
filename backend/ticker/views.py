from typing import Any, Dict, List, Optional

from django.db import models
from django.http import HttpRequest
from rest_framework import authentication, generics, permissions, views, viewsets
from rest_framework.response import Response

from ticker.api_utils import TwelveDataCore
from ticker.forms import TimeSeriesForm
from ticker.models import Ticker, TickerSettings
from ticker.serializers import (
    DictSerializer,
    TickerSerializer,
    TickerSettingsSerializer,
    TimeSeriesSerializer,
)


class SearchTicker(generics.ListAPIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = DictSerializer

    def get_queryset(self) -> List[Dict]:
        stock_client = TwelveDataCore()
        return stock_client.search_symbol(self.request.query_params.get("q"))


class TimeSeries(views.APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TimeSeriesSerializer

    def get(self, request: HttpRequest, format: Optional[Any] = None) -> Response:
        stock_client = TwelveDataCore()

        # create form instance and validate input
        form = TimeSeriesForm(request.query_params, request=request)
        if not form.is_valid():
            return Response({"detail": f"Invalid input: {form.errors}"}, status=400)

        # extract cleaned data from form and pass to stock_client
        tickers = form.cleaned_data["symbols"]
        start = form.cleaned_data.get("start", None)
        end = form.cleaned_data.get("end", None)
        days = form.cleaned_data.get("days", 30)

        serializer = TimeSeriesSerializer(stock_client(tickers, start=start, end=end, days=days), many=True)
        return Response(serializer.data)


class TickerSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = TickerSettingsSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = TickerSettings.objects.all()
    lookup_field = "user"

    def get_queryset(self, request: HttpRequest) -> TickerSettings:
        settings, _ = TickerSettings.objects.get_or_create(user=request.user)
        return settings

    def retrieve(self, request: HttpRequest) -> Response:
        settings, _ = TickerSettings.objects.get_or_create(user=request.user)

        serializer = TickerSettingsSerializer(settings)
        return Response(serializer.data)

    def update(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Response:
        settings, _ = TickerSettings.objects.get_or_create(user=request.user)
        partial = request.data.pop("partial", False)
        # add user to data
        serializer = TickerSettingsSerializer(settings, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Settings updated"}, status=200)
        return Response({"detail": serializer.errors}, status=400)


class UserTickerViewSet(viewsets.ModelViewSet):
    serializer_class = TickerSerializer
    # permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.TokenAuthentication,)
    queryset = Ticker.objects.all()

    def get_queryset(self) -> models.QuerySet[Ticker]:
        settings, _ = TickerSettings.objects.get_or_create(user=self.request.user)
        return settings.user_tickers.all()

    def list(self, request: HttpRequest) -> Response:
        settings, _ = TickerSettings.objects.get_or_create(user=request.user)
        tickers = settings.user_tickers.all()
        # tickers = tickers.order_by("symbol")
        # order by favorite then by symbol
        tickers = tickers.order_by("-is_favorite", "symbol")
        serializer = TickerSerializer(tickers, many=True)
        return Response(serializer.data)

    def create(self, request: HttpRequest) -> Response:
        settings, _ = TickerSettings.objects.get_or_create(user=request.user)
        user_tickers = settings.user_tickers
        ticker = Ticker.get_or_create_using_str(
            ticker_set=user_tickers,
            symbol=request.data.get("symbol"),
            exchange=request.data.get("exchange"),
        )
        settings.user_tickers.add(ticker)
        settings.save()
        return Response({"detail": "Ticker added to user settings."}, status=201)

    def update(self, request: HttpRequest, pk: str, *args: Any, **kwargs: Any) -> Response:
        ticker = Ticker.objects.get(pk=pk)
        partial = kwargs.pop("partial", False)
        serializer = TickerSerializer(ticker, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Ticker updated"}, status=200)
        return Response({"detail": serializer.errors}, status=400)

    def destroy(self, request: HttpRequest, pk: str) -> Response:
        settings, _ = TickerSettings.objects.get_or_create(user=request.user)
        ticker = Ticker.objects.get(pk=pk)
        settings, _ = TickerSettings.objects.get_or_create(user=request.user)
        settings.user_tickers.remove(ticker)
        ticker.delete()
        settings.save()
        return Response({"detail": "Ticker removed from settings."}, status=204)
