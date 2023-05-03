from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.gen_utils import get_token


class Symbol(models.Model):
    """Fields used to identify a unique symbol."""

    id = models.CharField(primary_key=True, max_length=100, default=get_token)
    symbol = models.CharField(max_length=64)
    exchange = models.CharField(max_length=64)

    def __str__(self) -> str:
        return self.comp_name

    @property
    def comp_name(self) -> str:
        return self.symbol + ":" + self.exchange

    def __eq__(self, other):
        return self.id == other.id


class Ticker(models.Model):
    id = models.CharField(primary_key=True, max_length=64, default=get_token)
    is_favorite = models.BooleanField(default=False)
    symbol = models.OneToOneField(Symbol, unique=True, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.symbol)


class TickerSettings(models.Model):
    """Settings for the display of tickers"""

    id = models.CharField(primary_key=True, max_length=64, default=get_token)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    user_tickers = models.ManyToManyField(Ticker, blank=True)
    plot_range = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(30)], default=5
    )
    stats_range = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(30)], default=1
    )

    def __str__(self) -> str:
        return str(self.user) + "'s Ticker Settings"
