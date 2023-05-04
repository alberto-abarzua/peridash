import pandas as pd
from rest_framework import serializers

from ticker.models import Symbol, Ticker, TickerSettings


class DictSerializer(serializers.Serializer):
    def to_representation(self, instance):
        return instance


class SymbolSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.comp_name

    class Meta:
        model = Symbol
        fields = "__all__"


class TimeSeriesSerializer(serializers.Serializer):
    df = serializers.SerializerMethodField()
    cur_price = serializers.FloatField()
    eod_price = serializers.FloatField()
    price_dif = serializers.FloatField()
    price_dif_percent = serializers.FloatField()
    symbol = SymbolSerializer()

    def get_df(self, obj):
        return pd.DataFrame.to_dict(obj.df)


class TickerSerializer(serializers.ModelSerializer):
    symbol = SymbolSerializer()
    is_favorite = serializers.BooleanField()

    class Meta:
        model = Ticker
        fields = "__all__"


class TickerSettingsSerializer(serializers.ModelSerializer):
    user_tickers = TickerSerializer(many=True)

    class Meta:
        model = TickerSettings
        fields = "__all__"
