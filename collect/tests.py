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
        self.card = Card.objects.get(id=10)
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
        self.assertEqual('1W', response.data['mana_string'])

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


class ManaCostTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.cost = ManaCost.objects.get(id=10)
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
