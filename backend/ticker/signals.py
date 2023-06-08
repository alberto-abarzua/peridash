from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from ticker.models import TickerSettings


@receiver(post_save, sender=get_user_model())
def create_ticker_settings(sender, instance, created, **kwargs):
    if created:
        TickerSettings.objects.create(user=instance)
