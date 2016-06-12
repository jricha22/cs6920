# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', models.CharField(unique=True, max_length=255)),
                ('layout', models.CharField(default=b'normal', max_length=32, choices=[(b'normal', b'normal'), (b'split', b'split'), (b'flip', b'flip'), (b'double-faced', b'double-faced'), (b'token', b'token'), (b'plane', b'plane'), (b'scheme', b'scheme'), (b'phenomenon', b'phenomenon'), (b'leveller', b'leveller'), (b'vanguard', b'vanguard')])),
                ('name', models.CharField(max_length=255)),
                ('cmc', models.IntegerField(default=0, null=True, verbose_name=b'Complete Mana Cost', blank=True)),
                ('type', models.CharField(max_length=255, db_index=True)),
                ('rarity', models.CharField(max_length=255, db_index=True)),
                ('text', models.TextField()),
                ('flavor', models.TextField()),
                ('artist', models.CharField(max_length=255)),
                ('number', models.CharField(max_length=32)),
                ('power_text', models.CharField(max_length=32)),
                ('toughness_text', models.CharField(max_length=32)),
                ('power', models.IntegerField(default=True, null=True)),
                ('toughness', models.IntegerField(default=True, null=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='ManaCost',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('color', models.CharField(default=b'Colorless', max_length=9, choices=[(b'Colorless', b'Colorless'), (b'Red', b'Red'), (b'Green', b'Green'), (b'Black', b'Black'), (b'Blue', b'Blue'), (b'White', b'White')])),
                ('count', models.IntegerField(default=0)),
            ],
            options={
                'ordering': ['color', 'count'],
            },
        ),
        migrations.AddField(
            model_name='card',
            name='mana_cost',
            field=models.ManyToManyField(to='collect.ManaCost'),
        ),
    ]
