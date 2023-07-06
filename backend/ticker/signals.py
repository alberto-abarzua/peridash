from typing import Any, Type

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser
from django.db.models import Model
from django.db.models.signals import post_save
from django.dispatch import receiver

from ticker.models import TickerSettings


@receiver(post_save, sender=get_user_model())
def create_ticker_settings(
    sender: Type[Model], instance: AbstractBaseUser, created: bool, **kwargs: Any
) -> None:
    if created:
        TickerSettings.objects.create(user=instance)
