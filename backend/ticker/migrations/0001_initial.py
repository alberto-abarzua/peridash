# Generated by Django 4.2 on 2023-05-02 18:35

import django.core.validators
from django.db import migrations, models

import core.gen_utils


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Symbol",
            fields=[
                (
                    "id",
                    models.CharField(
                        default=core.gen_utils.get_token,
                        max_length=64,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=100, unique=True)),
                ("is_trending", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Ticker",
            fields=[
                (
                    "id",
                    models.CharField(
                        default=core.gen_utils.get_token,
                        max_length=64,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("is_favorite", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="TickerSettings",
            fields=[
                (
                    "id",
                    models.CharField(
                        default=core.gen_utils.get_token,
                        max_length=64,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "plot_range",
                    models.IntegerField(
                        default=5,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(30),
                        ],
                    ),
                ),
                (
                    "stats_range",
                    models.IntegerField(
                        default=1,
                        validators=[
                            django.core.validators.MinValueValidator(1),
                            django.core.validators.MaxValueValidator(30),
                        ],
                    ),
                ),
            ],
        ),
    ]
