# Generated by Django 4.2 on 2023-05-02 23:14

from django.db import migrations, models

import peridash.gen_utils


class Migration(migrations.Migration):
    dependencies = [
        ("ticker", "0003_remove_symbol_is_trending_remove_symbol_name_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="symbol",
            name="id",
            field=models.CharField(
                default=peridash.gen_utils.get_token,
                max_length=65,
                primary_key=True,
                serialize=False,
            ),
        ),
    ]
