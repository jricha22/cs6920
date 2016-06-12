'''Defines all the view functions that handle HTTP requests/responses.'''

from django.conf import settings
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import views
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
    Get list of all cards in system and associated metadata
    """
    queryset = Card.objects.all()
    serializer_class = CardSerializer