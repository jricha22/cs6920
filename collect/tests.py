from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from collect.models import *


class CardTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.card = Card.objects.all()[0]
        self.card2 = Card.objects.all()[1]
        self.card_ten = Card.objects.all()[10]

    def test_card_list(self):
        response = self.client.get(reverse('card-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(5, len(response.data['results']))

    def test_card_detail(self):
        response = self.client.get(reverse('card-detail', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.card.name, response.data['name'])

    def test_card_detail_mana_string(self):
        response = self.client.get(reverse('card-detail', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('3B', response.data['mana_string'])

    def test_card_pagination_length(self):
        response = self.client.get(reverse('card-list'), {'limit': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(10, len(response.data['results']))

    def test_card_pagination_offset(self):
        response = self.client.get(reverse('card-list'), {'offset': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.card_ten.name, response.data['results'][0]['name'])

    def test_card_list_cost_filter(self):
        response = self.client.get(reverse('card-list'), {'manalimit': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(len(response.data['results'])):
            self.assertTrue(response.data['results'][i]['cmc'] <= 1)

    def test_card_list_color_filter_multiple(self):
        response = self.client.get(reverse('card-list'), {'color': 'Red,Blue'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(len(response.data['results'])):
            card_status = False
            for cost in response.data['results'][i]['mana_cost']:
                if cost["color"] in ['Red', 'Blue']:
                    card_status = True
            self.assertTrue(card_status)

    def test_card_list_color_filter_single(self):
        response = self.client.get(reverse('card-list'), {'color': 'Colorless'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(len(response.data['results'])):
            card_status = False
            for cost in response.data['results'][i]['mana_cost']:
                if cost["color"] in ['Colorless']:
                    card_status = True
            self.assertTrue(card_status)

    def test_card_list_owned_true_filter(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[12]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('card-list'), {'owned': 'true'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEquals(2, len(response.data['results']))

    def test_card_list_owned_false_filter(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[self.card2.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('card-list'), {'limit': 1000, 'owned': 'false'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEquals(Card.objects.all().count() - 2, len(response.data['results']))


class ManaCostTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.cost = ManaCost.objects.all()[0]
        self.cost_ten = ManaCost.objects.all()[10]

    def test_cost_list(self):
        response = self.client.get(reverse('manacost-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(5, len(response.data['results']))

    def test_cost_detail(self):
        response = self.client.get(reverse('manacost-detail', args=[self.cost.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.cost.color, response.data['color'])
        self.assertEqual(self.cost.count, response.data['count'])

    def test_cost_pagination_length(self):
        response = self.client.get(reverse('manacost-list'), {'limit': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(10, len(response.data['results']))

    def test_cost_pagination_offset(self):
        response = self.client.get(reverse('manacost-list'), {'offset': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.cost_ten.color, response.data['results'][0]['color'])


class CollectionTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.card = Card.objects.all()[0]

    def test_add_card_to_collection(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('card-list'), {'limit': 1000})
        card_found = False
        for card in response.data['results']:
            if card['id'] == self.card.id:
                self.assertEqual(card['cards_owned'], 1)
                card_found=True
                break
        self.assertEquals(True, card_found, msg="Card not found in card list!")

    def test_add_card_to_collection_twice(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('card-list'), {'limit': 1000})
        card_found = False
        for card in response.data['results']:
            if card['id'] == self.card.id:
                self.assertEqual(card['cards_owned'], 2)
                card_found = True
                break
        self.assertEquals(True, card_found, msg="Card not found in card list!")

    def test_add_card_to_collection_twice_remove_one(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('collection-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('card-list'), {'limit': 1000})
        card_found = False
        for card in response.data['results']:
            if card['id'] == self.card.id:
                self.assertEqual(card['cards_owned'], 1)
                card_found = True
                break
        self.assertEquals(True, card_found, msg="Card 10 not found in card list!")

    def test_add_card_to_collection_twice_remove_two(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('collection-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('collection-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('card-list'), {'limit': 1000})
        card_found = False
        for card in response.data['results']:
            if card['id'] == self.card.id:
                self.assertEqual(card['cards_owned'], 0)
                card_found = True
                break
        self.assertEquals(True, card_found, msg="Card 10 not found in card list!")

    def test_add_card_to_collection_twice_remove_three(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('collection-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('collection-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('collection-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_card_to_collection_other_user_does_not_have(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.superuser = User.objects.create_superuser('tsmith', 'o@o.com', 'pass1234')
        self.client.login(username='tsmith', password='pass1234')
        response = self.client.get(reverse('card-list'), {'limit': 1000})
        card_found = False
        for card in response.data['results']:
            if card['id'] == self.card.id:
                self.assertEqual(card['cards_owned'], 0)
                card_found=True
                break
        self.assertEquals(True, card_found, msg="Card  not found in card list!")


class DeckTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.card = Card.objects.all()[0]
        self.land = Card.objects.filter(type__startswith="Basic Land")[0]

    def test_add_card_to_deck(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        col = Collection.objects.get(user=self.superuser, card_id=self.card.id)
        self.assertEqual(1, col.in_deck)

    def test_add_2_cards_to_deck(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        col = Collection.objects.get(user=self.superuser, card_id=self.card.id)
        self.assertEqual(2, col.in_deck)

    def test_add_2_cards_to_deck_with_one_in_collection(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        col = Collection.objects.get(user=self.superuser, card_id=self.card.id)
        self.assertEqual(1, col.in_deck)

    def test_add_5_cards_to_deck_with_5_in_collection_fails(self):
        for i in range(5):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(4):
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        col = Collection.objects.get(user=self.superuser, card_id=self.card.id)
        self.assertEqual(4, col.in_deck)

    def test_add_5_land_cards_to_deck_with_5_in_collection_succeeds(self):
        for i in range(5):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(5):
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        col = Collection.objects.get(user=self.superuser, card_id=self.land.id)
        self.assertEqual(5, col.in_deck)

    def test_delete_card_from_deck(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        col = Collection.objects.get(user=self.superuser, card_id=self.card.id)
        self.assertEqual(1, col.in_deck)
        response = self.client.delete(reverse('deck-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_card_from_deck_without_card_fails(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('deck-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_2_cards_to_deck_with_2_remove_one_from_collection(self):
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('collection-add-card', args=[self.card.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        col = Collection.objects.get(user=self.superuser, card_id=self.card.id)
        self.assertEqual(1, col.in_deck)

    def test_add_2_cards_3_lands_to_deck_get_deck(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('deck'))
        self.assertEqual(2, len(response.data["cards"]))
        for item in response.data["cards"]:
            self.assertTrue(item["id"] in [self.land.id, self.card.id])
        self.assertFalse(response.data["valid"])
        self.assertEqual(5, response.data["size"])

    def test_wipe_deck(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('deck'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('deck'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(0, len(response.data["cards"]))

    def test_deck_valid(self):
        for i in range(4):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertFalse(response.data["valid"])
        for i in range(35):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertFalse(response.data["valid"])
        response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["valid"])

    def test_deck_color_spread(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('deck'))
        self.assertEquals(60, response.data["color_spread"]["Colorless"])
        self.assertEquals(40, response.data["color_spread"]["Black"])

    def test_deck_type_spread(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('deck'))
        self.assertEquals(60, response.data["type_spread"]["Land"])
        self.assertEquals(40, response.data["type_spread"]["Creature"])

    def test_deck_mana_curve(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(reverse('deck'))
        self.assertEquals(3, response.data["mana_curve"][0])
        self.assertEquals(2, response.data["mana_curve"][4])



class PublishDeckTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.card = Card.objects.all()[0]
        self.land = Card.objects.filter(type__startswith="Basic Land")[0]

    def publishDeck(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publish-deck', args=['my_deck']), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def publishDeckTwiceFails(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publish-deck', args=['my_deck']), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publish-deck', args=['my_deck2']), {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def deletePublishedDeck(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publish-deck', args=['my_deck']), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.delete(reverse('publish-deck', args=['my_deck2']), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def deletePublishedDeckWithNonePublishedSucceeds(self):
        response = self.client.delete(reverse('publish-deck', args=['my_deck2']), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class PublicDeckTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.card = Card.objects.all()[0]
        self.land = Card.objects.filter(type__startswith="Basic Land")[0]

    def publishDeck(self):
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publish-deck', args=['my_deck']), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publicdeck'), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEquals(1, len(response.results))
        self.assertEquals('my_deck', response.results[0]["name"])
        self.assertEquals(self.superuser.id, response.results[0]["user"])

    def publish2UsersDeck(self):
        self.publishDeck()
        self.superuser2 = User.objects.create_superuser('jdoe2', 'o@o.com', 'pass1234')
        self.client.login(username='jdoe2', password='pass1234')
        for i in range(2):
            response = self.client.post(reverse('collection-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.card.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(3):
            response = self.client.post(reverse('collection-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            response = self.client.post(reverse('deck-add-card', args=[self.land.id]), {})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publish-deck', args=['my_deck2']), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.post(reverse('publicdeck'), {})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEquals(2, len(response.results))
        user1 = False
        user2 = False
        for item in response.results:
            if item["user"] == self.superuser.id and item["name"] == "my_deck":
                user1 = True
            if item["user"] == self.superuser2.id and item["name"] == "my_deck2":
                user2 = True
        self.assertTrue(user1)
        self.assertTrue(user2)
