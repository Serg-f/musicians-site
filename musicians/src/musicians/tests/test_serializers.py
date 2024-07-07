from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from unittest.mock import Mock
from musicians.serializers import MusicianSerializer, StyleSerializer
from musicians.models import Musician, Style

User = get_user_model()

class MusicianSerializerTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.style = Style.objects.create(name='Rock', slug='rock')
        self.user = User.objects.create_user(username='testuser', password='12345')
        request = self.factory.get('/v1/musicians/')
        self.style_url = StyleSerializer(self.style, context={'request': request}).data['url']
        self.musician_data = {
            'title': 'Test Musician',
            'content': 'Test Content' * 8,
            'style': self.style_url,
        }

    def test_valid_serializer(self):
        request = self.factory.post('/v1/musicians/')
        request.user = self.user

        serializer = MusicianSerializer(data=self.musician_data, context={'request': request})
        self.assertTrue(serializer.is_valid(raise_exception=True))
        musician = serializer.save()
        self.assertEqual(musician.title, self.musician_data['title'])
        self.assertEqual(musician.content, self.musician_data['content'])
        self.assertEqual(musician.author_id, self.user.id)
        self.assertEqual(musician.style, self.style)

    def test_invalid_serializer(self):
        invalid_data = self.musician_data.copy()
        invalid_data['title'] = ''

        request = self.factory.post('/v1/musicians/')
        request.user = self.user

        serializer = MusicianSerializer(data=invalid_data, context={'request': request})
        self.assertFalse(serializer.is_valid())
