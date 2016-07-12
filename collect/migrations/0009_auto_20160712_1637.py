# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('collect', '0008_auto_20160712_1628'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deckvote',
            name='vote',
            field=models.PositiveSmallIntegerField(default=1, choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]),
        ),
    ]
