# Generated by Django 4.2.1 on 2023-06-06 01:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ticker", "0007_alter_ticker_id_alter_tickersettings_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="ticker",
            name="symbol",
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="ticker.symbol"),
        ),
    ]