from django.test import SimpleTestCase
from django.urls import resolve, reverse

from users_app.views import CustomTokenObtainPairView, RegisterView


class TestUrls(SimpleTestCase):

    def test_register_url_resolves(self):
        url = reverse('register')
        self.assertEqual(resolve(url).func.view_class, RegisterView)

    def test_token_url_resolves(self):
        url = reverse('token_obtain_pair')
        self.assertEqual(resolve(url).func.view_class, CustomTokenObtainPairView)
