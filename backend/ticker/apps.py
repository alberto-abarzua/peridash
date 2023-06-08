from django.apps import AppConfig


class TickerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ticker"

    def ready(self):
        import ticker.signals  # noqa: F401
