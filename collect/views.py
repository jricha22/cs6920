'''Defines all the view functions that handle HTTP requests/responses.'''

from django.db import IntegrityError
from django.core.exceptions import ValidationError, NON_FIELD_ERRORS
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from rest_framework.views import APIView
from collect.serializers import *
from collect.models import *


class EmptySerializer(serializers.Serializer):
    empty = serializers.HiddenField(default=None,allow_null=True)


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
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('name',)

    def get_queryset(self):
        queryset = Card.objects.all()
        mana_limit = self.request.query_params.get('manalimit', None)
        if mana_limit is not None:
            queryset = queryset.filter(cmc__lte=mana_limit)
        color = self.request.query_params.get('color', None)
        if color is not None:
            queryset = queryset.filter(mana_cost__color__in=color.split(','))
        owned = self.request.query_params.get('owned', None)
        if owned is not None:
            if owned == "true":
                queryset = queryset.filter(collection__user_id=self.request.user.id)
            else:
                queryset = queryset.exclude(collection__user_id=self.request.user.id)
        return queryset


class CollectionAddCardView(APIView):
    """
    MTG add/delete card to/from collection
    """
    serializer_class = EmptySerializer

    @staticmethod
    def post(request, card_id, format=None):
        try:
            col, created = Collection.objects.get_or_create(user=request.user, card_id=card_id)
        except IntegrityError:
            return Response("Card with that ID does not exist", status=status.HTTP_400_BAD_REQUEST)
        if not created:
            col.count += 1
            col.save()
        return Response("Success", status=status.HTTP_200_OK)

    @staticmethod
    def delete(request, card_id, format=None):
        try:
            col = Collection.objects.get(user=request.user, card_id=card_id)
        except Collection.DoesNotExist:
            return Response("Could not find card with that ID", status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as exc:
            return Response(exc, status=status.HTTP_400_BAD_REQUEST)
        if col.count == 1:
            col.delete()
        else:
            col.count -= 1
            if col.in_deck > col.count:
                col.in_deck = col.count
            col.save()
        return Response("Success", status=status.HTTP_200_OK)


class DeckAddCardView(APIView):
    """
    MTG add/delete card to/from deck
    """
    serializer_class = EmptySerializer

    @staticmethod
    def post(request, card_id, format=None):
        try:
            col = Collection.objects.get(card_id=card_id)
        except Collection.DoesNotExist:
            return Response("Card with that ID not in collection", status=status.HTTP_400_BAD_REQUEST)
        try:
            col.in_deck += 1
            col.save()
        except ValidationError as exc:
            return Response(exc.message_dict[NON_FIELD_ERRORS][0], status=status.HTTP_400_BAD_REQUEST)
        return Response("Success", status=status.HTTP_200_OK)

    @staticmethod
    def delete(request, card_id, format=None):
        try:
            col = Collection.objects.get(user=request.user, card_id=card_id)
        except Collection.DoesNotExist:
            return Response("Card with that ID not in collection", status=status.HTTP_400_BAD_REQUEST)
        if col.in_deck:
            col.in_deck -= 1
            col.save()
        else:
            return Response("Card with that ID not in deck", status=status.HTTP_400_BAD_REQUEST)
        return Response("Success", status=status.HTTP_200_OK)
