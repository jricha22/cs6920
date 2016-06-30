# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collect', '0005_collection_in_deck'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='count',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='collection',
            name='in_deck',
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
