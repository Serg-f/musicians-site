from django.test import SimpleTestCase
from django.urls import resolve, reverse
from musicians.views import MusiciansViewSet


class TestUrls(SimpleTestCase):

    def test_musicians_url_resolves(self):
        url = reverse('musician-list')
        self.assertEqual(resolve(url).func.cls, MusiciansViewSet)
