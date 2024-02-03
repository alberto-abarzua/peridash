from __future__ import annotations

from typing import Any

from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from peridash.gen_utils import get_token


class Symbol(models.Model):
    """Fields used to identify a unique symbol."""

    id = models.CharField(primary_key=True, max_length=100, default=get_token)
    symbol = models.CharField(max_length=64)
    exchange = models.CharField(max_length=64)

    def __str__(self) -> str:
        return self.comp_name

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.exchange = self.exchange.replace(" ", "")
        super().save(*args, **kwargs)

    @property
    def comp_name(self) -> str:
        return self.symbol + ":" + self.exchange

    def __eq__(self, other: Any) -> bool:
        return self.id == other.id


class Ticker(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=get_token)
    is_favorite = models.BooleanField(default=False)
    symbol = models.ForeignKey(Symbol, on_delete=models.CASCADE)
    # 3 float fields, to_buy, gain, loss
    buy = models.FloatField(default=0.0)
    gain = models.FloatField(default=0.0)
    loss = models.FloatField(default=0.0)

    def __str__(self) -> str:
        return str(self.symbol)

    @classmethod
    def create_using_str(cls, symbol: str, exchange: str) -> Ticker:
        symbol_obj, _ = Symbol.objects.get_or_create(symbol=symbol, exchange=exchange)
        ticker_obj = Ticker.objects.create(symbol=symbol_obj)
        return ticker_obj

    @classmethod
    def get_or_create_using_str(cls, ticker_set: models.QuerySet, symbol: str, exchange: str) -> Ticker:
        try:
            ticker_obj = ticker_set.get(symbol__symbol=symbol, symbol__exchange=exchange)
        except Ticker.DoesNotExist:
            symbol_obj, _ = Symbol.objects.get_or_create(symbol=symbol, exchange=exchange)
            ticker_obj = Ticker.objects.create(symbol=symbol_obj)
        return ticker_obj


class TickerSettings(models.Model):
    """Settings for the display of tickers"""

    id = models.CharField(primary_key=True, max_length=100, default=get_token)
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    user_tickers = models.ManyToManyField(Ticker, blank=True)
    plot_range = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(30)], default=5)
    stats_range = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(30)], default=1)

    def __str__(self) -> str:
        return str(self.user) + "'s Ticker Settings"
