'''Defines all the custom REST serializers used by this application.'''

from rest_framework import serializers
from collect.models import *


class CardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
