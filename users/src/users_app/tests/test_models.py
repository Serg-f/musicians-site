from django.test import TestCase
from users_app.models import CustomUser


class CustomUserModelTest(TestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser', email='testuser@example.com', password='password123'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertTrue(self.user.check_password('password123'))

    def test_user_str(self):
        self.assertEqual(str(self.user), self.user.username)
