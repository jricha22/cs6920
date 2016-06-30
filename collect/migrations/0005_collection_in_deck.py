# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collect', '0004_collection'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='in_deck',
            field=models.IntegerField(default=0),
        ),
    ]
