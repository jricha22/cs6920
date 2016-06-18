'''Defines all the view functions that handle HTTP requests/responses.'''

import json
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from collect.serializers import *
from collect.models import *


@api_view(('GET',))
def collect_root(request, format=None):
    return Response({
        'card': reverse('card-list', request=request, format=format),
        'manacost': reverse('manacost-list', request=request, format=format),
    })


class ManaCostViewSet(viewsets.ModelViewSet):
    """
    Get list of all mana costs in system
    """
    queryset = ManaCost.objects.all()
    serializer_class = ManaCostSerializer


class CardsViewSet(viewsets.ModelViewSet):
    """
    Get list of all cards in system and associated metadata. Accepts filter query params:
    ?color=Red,Blue returns all red or blue cards
    ?manalimt=5 returnes cards with cost 5 or less
    ?color=Red,Blue&manalimit=5&limit=10 returns the first 10 red or blue cards with cost 5 or less
    ?color=Red,Blue&manalimit=5&limit=10&offset=10 returns 10 cards red or blue cards with cost 5 or less, skipping the first 10 results
    """
    serializer_class = CardSerializer

    def get_queryset(self):
        queryset = Card.objects.all()
        mana_limit = self.request.query_params.get('manalimit', None)
        if mana_limit is not None:
            queryset = queryset.filter(cmc__lte=mana_limit)
        color = self.request.query_params.get('color', None)
        if color is not None:
            queryset = queryset.filter(mana_cost__color__in=color.split(','))
        return queryset