from django import forms


class TimeSeriesForm(forms.Form):
    symbols = forms.CharField()
    start = forms.DateTimeField(required=False)
    end = forms.DateTimeField(required=False)
    days = forms.IntegerField(required=False)

    def clean_symbols(self):
        symbols = self.cleaned_data["symbols"]
        if "," in symbols:
            symbols = symbols.split(",")
        else:
            symbols = [symbols]
        symbol_exchange = []
        for symbol in symbols:
            if ":" not in symbol:
                raise forms.ValidationError(
                    'Symbols must be in the format "symbol:exchange"'
                )

            symbol, exchange = symbol.split(":")
            symbol_exchange.append((symbol, exchange))
        return symbol_exchange
