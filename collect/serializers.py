'''Defines all the custom REST serializers used by this application.'''

from rest_framework import serializers
from collect.models import *


class ManaCostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManaCost


class PublicDeckSerializer(serializers.ModelSerializer):
    average_rating = serializers.ReadOnlyField()

    class Meta:
        model = PublicDeck


class CardSerializer(serializers.ModelSerializer):
    mana_cost = ManaCostSerializer(read_only=True, many=True)
    mana_string = serializers.ReadOnlyField()
    cards_owned = serializers.SerializerMethodField()

    def get_cards_owned(self, obj):
        try:
            col = Collection.objects.get(user=self.context['request'].user, card=obj.id)
        except Collection.DoesNotExist:
            return 0
        return col.count


    class Meta:
        model = Card
