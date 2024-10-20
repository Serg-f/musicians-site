from django.test import TestCase

from musicians.models import Musician, Style


class MusicianModelTest(TestCase):

    def setUp(self):
        self.style = Style.objects.create(name='Rock', slug='rock')
        self.musician = Musician.objects.create(
            title='Test Musician',
            content='Test Content',
            style=self.style,
            author_id=1
        )

    def test_musician_creation(self):
        self.assertEqual(self.musician.title, 'Test Musician')
        self.assertEqual(self.musician.content, 'Test Content')
        self.assertEqual(self.musician.style.name, 'Rock')
        self.assertEqual(self.musician.author_id, 1)

    def test_musician_str(self):
        self.assertEqual(str(self.musician), self.musician.title)


class StyleModelTest(TestCase):

    def setUp(self):
        self.style = Style.objects.create(name='Rock', slug='rock')

    def test_style_creation(self):
        self.assertEqual(self.style.name, 'Rock')
        self.assertEqual(self.style.slug, 'rock')

    def test_style_str(self):
        self.assertEqual(str(self.style), self.style.name)
