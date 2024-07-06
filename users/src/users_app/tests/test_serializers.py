from django.test import TestCase
from users_app.serializers import RegisterSerializer
from users_app.models import CustomUser


class RegisterSerializerTest(TestCase):

    def test_valid_serializer(self):
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123'
        }
        serializer = RegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsInstance(user, CustomUser)
        self.assertEqual(user.username, data['username'])
        self.assertEqual(user.email, data['email'])

    def test_invalid_serializer(self):
        data = {
            'username': '',
            'email': 'invalid-email',
            'password': ''
        }
        serializer = RegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
