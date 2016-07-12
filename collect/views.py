'''Defines all the view functions that handle HTTP requests/responses.'''

from django.db import IntegrityError
from django.db.models import F, Sum
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
        'deck': reverse('deck', request=request, format=format),
        'publicdeck': reverse('publicdeck-list', request=request, format=format)
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
            col = Collection.objects.get(user=request.user, card_id=card_id)
        except Collection.DoesNotExist:
            return Response("Card with that ID not in collection", status=status.HTTP_400_BAD_REQUEST)
        try:
            col.in_deck += 1
            col.save()
        except ValidationError as exc:
            return Response(exc.message_dict[NON_FIELD_ERRORS][0], status=status.HTTP_400_BAD_REQUEST)
        card_count = Collection.objects.filter(user=request.user).aggregate(card_count=Sum(F('in_deck')))["card_count"]
        return Response({"valid": card_count >= 40}, status=status.HTTP_200_OK)

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
        card_count = Collection.objects.filter(user=request.user).aggregate(card_count=Sum(F('in_deck')))["card_count"]
        return Response({"valid": card_count >= 40}, status=status.HTTP_200_OK)


class DeckView(APIView):
    """
    MTG add/delete card to/from deck
    """
    serializer_class = CardSerializer

    @staticmethod
    def get(request, format=None):
        query = Card.objects.filter(collection__user=request.user, collection__in_deck__gt=0)
        card_list = []
        card_count = Collection.objects.filter(user=request.user).aggregate(card_count=Sum(F('in_deck')))["card_count"]
        if card_count >= 40:
            valid = True
            message = "Deck is valid"
        else:
            valid = False
            message = "Deck must have at least 40 cards"
        colors = {"Colorless": 0, "Black": 0, "Blue": 0, "Green": 0, "Red": 0, "White": 0}
        types = {"Creature": 0, "Artifact": 0, "Sorcery": 0, "Enchantment": 0, "Instant": 0, "Planeswalker": 0, "Land": 0}
        curve = [0] * 10
        for card in query:
            mana_string = card.mana_string
            num_cards = card.collection_set.filter(user=request.user)[0].in_deck
            curve[card.cmc] += num_cards
            colorless = True
            if 'U' in mana_string:
                colors["Blue"] += num_cards
                colorless = False
            if 'B' in mana_string:
                colors["Black"] += num_cards
                colorless = False
            if 'G' in mana_string:
                colors["Green"] += num_cards
                colorless = False
            if 'R' in mana_string:
                colors["Red"] += num_cards
                colorless = False
            if 'W' in mana_string:
                colors["White"] += num_cards
                colorless = False
            if colorless:
                colors["Colorless"] += num_cards
            if "Creature" in card.type:
                types["Creature"] += num_cards
            if "Artifact" in card.type:
                types["Artifact"] += num_cards
            if "Sorcery" in card.type:
                types["Sorcery"] += num_cards
            if "Enchantment" in card.type:
                types["Enchantment"] += num_cards
            if "Instant" in card.type:
                types["Instant"] += num_cards
            if "Planeswalker" in card.type:
                types["Planeswalker"] += num_cards
            if "Land" in card.type:
                types["Land"] += num_cards
            card_list.append({"id": card.id, "name": card.name, "type": card.type, "cmc": card.cmc,
                           "rarity": card.rarity, "power_text": card.power_text, "power": card.power,
                           "toughness_text": card.toughness_text, "toughness": card.toughness,
                           "count": card.collection_set.filter(user=request.user)[0].in_deck})
        if card_count:
            for key in colors.keys():
                colors[key] = int(colors[key]/float(card_count) * 100 + 0.5)
            for key in types.keys():
                types[key] = int(types[key] / float(card_count) * 100 + 0.5)
        result = {"valid": valid, "message": message, "size": card_count, "color_spread": colors,
                  "type_spread": types, "mana_curve": curve, "cards": card_list}
        return Response(result)

    @staticmethod
    def delete(request, format=None):
        Collection.objects.filter(user=request.user).update(in_deck=0)
        return Response("Success", status=status.HTTP_200_OK)


class PublishDeckView(APIView):
    """
    MTG publish or unpublish a users deck
    """
    serializer_class = EmptySerializer

    @staticmethod
    def post(request, name, format=None):
        public = PublicDeck(user=request.user, name=name)
        try:
            public.save()
        except IntegrityError:
            return Response("User already has a published deck! Delete old one first!", status=status.HTTP_400_BAD_REQUEST)
        return Response("Deck published", status=status.HTTP_200_OK)

    @staticmethod
    def delete(request, name, format=None):
        PublicDeck.objects.filter(user=request.user).delete()
        return Response("Published deck removed", status=status.HTTP_200_OK)

class PublicDeckViewSet(viewsets.ModelViewSet):
    """
    Get list of all published decks in the system
    """
    queryset = PublicDeck.objects.all()
    serializer_class = PublicDeckSerializer