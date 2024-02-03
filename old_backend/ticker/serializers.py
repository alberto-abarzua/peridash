from typing import Any, Dict, Hashable

import pandas as pd
from rest_framework import serializers

from ticker.api_utils import TickerInfo
from ticker.models import Symbol, Ticker, TickerSettings


class DictSerializer(serializers.Serializer):
    def to_representation(self, instance: Dict) -> Dict:
        return instance


class SymbolSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj: Symbol) -> str:
        return obj.comp_name

    class Meta:
        model = Symbol
        fields = "__all__"


class TickerSerializer(serializers.ModelSerializer):
    symbol = SymbolSerializer()

    class Meta:
        model = Ticker
        fields = "__all__"


class TickerSettingsSerializer(serializers.ModelSerializer):
    user_tickers = TickerSerializer(many=True)

    class Meta:
        model = TickerSettings
        fields = "__all__"


class TimeSeriesSerializer(serializers.Serializer):
    df = serializers.SerializerMethodField()
    cur_price = serializers.FloatField()
    eod_price = serializers.FloatField()
    price_dif = serializers.FloatField()
    price_dif_percent = serializers.FloatField()
    ticker = TickerSerializer()

    def get_df(self, ticker_info: TickerInfo) -> Dict[Hashable, Any]:
        return pd.DataFrame.to_dict(ticker_info.df)
