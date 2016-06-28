from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient


class UserTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()
        self.client.login(username='jdoe', password='pass1234')
        self.user = User.objects.create(username="tsmith")

    def test_user_list(self):
        response = self.client.get(reverse('user-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(2, len(response.data['results']))

    def test_user_detail(self):
        response = self.client.get(reverse('user-detail', args=[self.user.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('tsmith', response.data['username'])


class ProfileTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()

    def test_user_not_logged_in(self):
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_logged_in(self):
        self.client.login(username='jdoe', password='pass1234')
        response = self.client.get(reverse('profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('jdoe', response.data['username'])


class LoginTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()

    def test_credentials_good(self):
        response = self.client.post(reverse('login'), {'username': 'jdoe', 'password': 'pass1234'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('jdoe', response.data['username'])

    def test_credentials_bad(self):
        response = self.client.post(reverse('login'), {'username': 'nobody', 'password': 'idonthaveone'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CreateAccountTest(APITestCase):
    def setUp(self):
        self.superuser = User.objects.create_superuser('jdoe', 'o@o.com', 'pass1234')
        self.client = APIClient()

    def test_credentials_good(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'password': 'mypass', 'first_name': 'Tom', 'last_name': 'Smith', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('tsmith', response.data['username'])

    def test_credentials_missing_field_email(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'password': 'mypass', 'first_name': 'Tom', 'last_name': 'Smith'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_missing_field_last_name(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'password': 'mypass', 'first_name': 'Tom', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_missing_field_first_name(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'password': 'mypass', 'last_name': 'Smith', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_missing_field_password(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'first_name': 'Tom', 'last_name': 'Smith', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_missing_field_username(self):
        response = self.client.post(reverse('create-account'), {'password': 'mypass', 'first_name': 'Tom', 'last_name': 'Smith', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_no_password_bad(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'password': '', 'first_name': 'tom', 'last_name': 'smith', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_no_first_name_bad(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'password': 'mypass', 'first_name': '', 'last_name': 'smith', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_no_last_name_bad(self):
        response = self.client.post(reverse('create-account'), {'username': 'tsmith', 'password': 'mypass', 'first_name': 'tom', 'last_name': '', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_no_username_bad(self):
        response = self.client.post(reverse('create-account'), {'username': '', 'password': 'mypass', 'first_name': 'tom', 'last_name': 'smith', 'email': 'tsmith@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_credentials_already_exists(self):
        response = self.client.post(reverse('create-account'), {'username': 'jdoe', 'password': 'mypass', 'first_name': 'Jane', 'last_name': 'Doe', 'email': 'jdoe@gmail.com'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual('Username already exists', response.data)

