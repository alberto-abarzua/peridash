from django import forms
from ticker.models import Symbol,TickerSettings

class TimeSeriesForm(forms.Form):
    symbols = forms.CharField()
    start = forms.DateTimeField(required=False)
    end = forms.DateTimeField(required=False)
    days = forms.IntegerField(required=False)
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(TimeSeriesForm, self).__init__(*args, **kwargs)

    def clean_symbols(self):
        symbols = self.cleaned_data["symbols"]
        if symbols == "__ALL_USER__":
            user_settings = TickerSettings.objects.get(user=self.request.user)
            return [ticker.symbol for ticker in user_settings.user_tickers.all()]
        if "," in symbols:
            symbols = symbols.split(",")
        else:
            symbols = [symbols]
        db_symbols = []
        for symbol in symbols:
            if ":" not in symbol:
                raise forms.ValidationError(
                    'Symbols must be in the format "symbol:exchange"'
                )

            symbol, exchange = symbol.split(":")
            cur_sym, _ = Symbol.objects.get_or_create(
                symbol=symbol,
                exchange=exchange,
                defaults={"symbol": symbol, "exchange": exchange},
            )  
            db_symbols.append(cur_sym)
        return db_symbols
