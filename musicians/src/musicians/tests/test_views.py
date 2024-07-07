from unittest.mock import patch, Mock
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from musicians.models import Musician, Style
from musicians.serializers import UserSerializer

class MusicianViewSetTest(APITestCase):

    def setUp(self):
        self.style = Style.objects.create(name='Rock', slug='rock')
        self.musician = Musician.objects.create(
            title='Test Musician',
            content='Test Content',
            style=self.style,
            author_id=1
        )
        self.list_url = reverse('musician-list')
        self.detail_url = reverse('musician-detail', kwargs={'pk': self.musician.pk})

    @patch('musicians.authentication.CustomTokenAuthentication.authenticate')
    def test_list_musicians(self, mock_authenticate):
        user_data = {
            'id': 1,
            'username': 'testuser',
            'email': 'testuser@example.com',
            'first_name': '',
            'last_name': '',
            'is_staff': False,
            'last_login': None,
        }
        user = UserSerializer().create_user(user_data)
        mock_authenticate.return_value = (user, None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('musicians.authentication.CustomTokenAuthentication.authenticate')
    def test_retrieve_musician(self, mock_authenticate):
        user_data = {
            'id': 1,
            'username': 'testuser',
            'email': 'testuser@example.com',
            'first_name': '',
            'last_name': '',
            'is_staff': False,
            'last_login': None,
        }
        user = UserSerializer().create_user(user_data)
        mock_authenticate.return_value = (user, None)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.musician.title)
