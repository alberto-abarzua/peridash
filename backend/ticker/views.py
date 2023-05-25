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

    def get_queryset(self):
        stock_client = TwelveDataCore()
        return stock_client.search_symbol(self.request.query_params.get("q"))


class TimeSeries(views.APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TimeSeriesSerializer

    def get(self, request, format=None):
        stock_client = TwelveDataCore()

        # create form instance and validate input
        form = TimeSeriesForm(request.query_params, request=request)
        if not form.is_valid():
            return Response({"detail": f"Invalid input: {form.errors}"}, status=400)

        # extract cleaned data from form and pass to stock_client
        symbols = form.cleaned_data["symbols"]
        start = form.cleaned_data.get("start", None)
        end = form.cleaned_data.get("end", None)
        days = form.cleaned_data.get("days", 30)

        serializer = TimeSeriesSerializer(
            stock_client(symbols, start=start, end=end, days=days), many=True
        )
        return Response(serializer.data)


class TickerSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = TickerSettingsSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    queryset = TickerSettings.objects.all()
    lookup_field = "user"

    def get_queryset(self):
        return TickerSettings.objects.filter(user=self.request.user)

    def retrieve(self, request):
        settings = TickerSettings.objects.get(user=request.user)
        serializer = TickerSettingsSerializer(settings)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        settings = TickerSettings.objects.get(user=request.user)
        partial = request.data.pop("partial", False)
        # add user to data
        serializer = TickerSettingsSerializer(
            settings, data=request.data, partial=partial
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Settings updated"}, status=200)
        return Response({"detail": serializer.errors}, status=400)


class UserTickerViewSet(viewsets.ModelViewSet):
    serializer_class = TickerSerializer
    # permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.TokenAuthentication,)
    queryset = Ticker.objects.all()

    def get_queryset(self):
        ticker_settings = TickerSettings.objects.get(user=self.request.user)
        return ticker_settings.user_tickers.all()

    def list(self, request):
        tickers = TickerSettings.objects.get(user=request.user).user_tickers.all()
        tickers = tickers.order_by("symbol")
        serializer = TickerSerializer(tickers, many=True)
        return Response(serializer.data)

    def create(self, request):
        settings = TickerSettings.objects.get(user=request.user)
        user_tickers = settings.user_tickers
        ticker = Ticker.get_or_create_using_str(
            ticker_set=user_tickers,
            symbol=request.data.get("symbol"),
            exchange=request.data.get("exchange"),
        )
        settings.user_tickers.add(ticker)
        settings.save()
        return Response({"detail": "Ticker added to user settings."}, status=200)

    def update(self, request, pk, *args, **kwargs):
        ticker = Ticker.objects.get(pk=pk)
        partial = kwargs.pop("partial", False)
        serializer = TickerSerializer(ticker, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Ticker updated"}, status=200)
        return Response({"detail": serializer.errors}, status=400)

    def destroy(self, request, pk):
        settings = TickerSettings.objects.get(user=request.user)
        ticker = Ticker.objects.get(pk=pk)
        settings = TickerSettings.objects.get(user=request.user)
        settings.user_tickers.remove(ticker)
        settings.save()
        return Response({"detail": "Ticker removed from settings."}, status=200)
