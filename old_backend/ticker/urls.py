from django.urls import include, path
from rest_framework import routers

from ticker import views

router = routers.DefaultRouter()
router.register(r"user-tickers", views.UserTickerViewSet, basename="user-tickers")

app_name = "ticker"
urlpatterns = [
    path("search/", views.SearchTicker.as_view(), name="search"),
    path("time_series/", views.TimeSeries.as_view(), name="time_series"),
    path("", include(router.urls)),
    path(
        "user-settings/",
        views.TickerSettingsViewSet.as_view({"get": "retrieve", "put": "update"}),
        name="user-settings",
    ),
]
