# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collect', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='card',
            name='power',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='card',
            name='toughness',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]
