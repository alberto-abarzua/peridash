from django import forms

from ticker.models import Ticker, TickerSettings


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
            return [ticker for ticker in user_settings.user_tickers.all()]
        if "," in symbols:
            symbols = symbols.split(",")
        else:
            symbols = [symbols]

        db_tickers = []
        for symbol in symbols:
            if ":" not in symbol:
                raise forms.ValidationError(
                    'Symbols must be in the format "symbol:exchange"'
                )

            symbol, exchange = symbol.split(":")
            cur_ticker = Ticker.get_or_create_using_str(
                ticker_set=Ticker.objects.all(),
                symbol=symbol,
                exchange=exchange,
            )
            db_tickers.append(cur_ticker)
        return db_tickers
