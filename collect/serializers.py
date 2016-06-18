'''Defines all the custom REST serializers used by this application.'''

from rest_framework import serializers
from collect.models import *

class ManaCostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManaCost


class CardSerializer(serializers.ModelSerializer):
    mana_cost = ManaCostSerializer(read_only=True, many=True)
    mana_string = serializers.ReadOnlyField()

    class Meta:
        model = Card
