# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import os
import json


def import_cards(apps, schema_editor):
    Card = apps.get_model("collect", "Card")
    ManaCost = apps.get_model("collect", "ManaCost")
    data_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'M15.json'))
    with open(data_path) as data_file:
        data = json.load(data_file)
    for item in data["cards"]:
        try:
            card = Card(uuid=item["id"], name=item["name"], type=item["type"], rarity=item["rarity"],
                        artist=item["artist"], number=item["number"], layout=item["layout"])
            if "power" in item.keys():
                card.power_text = item["power"]
                if card.power_text.isdigit():
                    card.power = int(card.power_text)
            if "toughness" in item.keys():
                card.toughness_text = item["toughness"]
                if card.toughness_text.isdigit():
                    card.toughness = int(card.toughness_text)
            if "flavor" in item.keys():
                card.flavor = item["flavor"]
            if "text" in item.keys():
                card.text = item["text"]

            # Must save card before adding M2M relations
            card.save()
            if "manaCost" in item.keys():
                colorless = 0
                red = 0
                blue = 0
                green = 0
                white = 0
                black = 0
                for cost in [x[1:] for x in item["manaCost"].split("}") if x]:
                    if cost.isdigit():
                        colorless = int(cost)
                    elif cost == "B":
                        black += 1
                    elif cost == "W":
                        white += 1
                    elif cost == "U":
                        blue += 1
                    elif cost == "G":
                        green += 1
                    elif cost == "R":
                        red += 1
                if colorless:
                    mana_cost, _ = ManaCost.objects.get_or_create(color="Colorless", count=colorless)
                    card.mana_cost.add(mana_cost)
                if red:
                    mana_cost, _ = ManaCost.objects.get_or_create(color="Red", count=red)
                    card.mana_cost.add(mana_cost)
                if green:
                    mana_cost, _ = ManaCost.objects.get_or_create(color="Green", count=green)
                    card.mana_cost.add(mana_cost)
                if blue:
                    mana_cost, _ = ManaCost.objects.get_or_create(color="Blue", count=blue)
                    card.mana_cost.add(mana_cost)
                if black:
                    mana_cost, _ = ManaCost.objects.get_or_create(color="Black", count=black)
                    card.mana_cost.add(mana_cost)
                if white:
                    mana_cost, _ = ManaCost.objects.get_or_create(color="White", count=white)
                    card.mana_cost.add(mana_cost)
                total = colorless + red + blue + green + white + black
                if total:
                    card.cmc = total
                    card.save()
        except Exception:
            print
            print "ERROR PARSING JSON:"
            print item
            raise


def undo_import_cards(apps, schema_editor):
    Card = apps.get_model("collect", "Card")
    Card.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('collect', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(import_cards, reverse_code=undo_import_cards),
    ]
