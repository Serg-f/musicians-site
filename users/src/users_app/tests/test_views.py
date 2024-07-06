from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users_app.models import CustomUser


class UserRegistrationTest(APITestCase):

    def setUp(self):
        self.url = reverse('register')
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123'
        }

    def test_user_registration(self):
        response = self.client.post(self.url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(CustomUser.objects.get().username, 'testuser')


class TokenObtainPairViewTest(APITestCase):

    def setUp(self):
        self.url = reverse('token_obtain_pair')
        self.user = CustomUser.objects.create_user(
            username='testuser', email='testuser@example.com', password='password123'
        )

    def test_token_obtain(self):
        response = self.client.post(self.url, {'username': 'testuser', 'password': 'password123'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
