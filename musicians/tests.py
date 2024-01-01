from django.test import TestCase, Client
from django.urls import reverse
from musicians.models import Musician, Style
from django.contrib.auth import get_user_model

User = get_user_model()


class SetUpMixin:
    def setUp(self):
        self.user_credentials = {
            'username': 'testuser',
            'password': '12345',
            'email': 'author@example.com'
        }
        self.user = User.objects.create_user(**self.user_credentials)
        self.style = Style.objects.create(name="Rock", slug="rock")
        self.article = Musician.objects.create(
            title="Test Article",
            content="Test Content Test Content Test Content Test Content Test Content Test Content Test Content",
            style=self.style,
            author=self.user,
            is_published=True
        )
        self.post_data = {
            'title': 'New Rock Article',
            'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget fermentum',
            'style': self.style.id,
            'is_published': True,
        }


class ArticlesListTestCase(SetUpMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('musicians:home')

    def test_articles_list_page(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'musicians/articles_list.html')
        self.assertEqual(len(response.context['object_list']), 1)


class ArticleDetailTestCase(SetUpMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('musicians:article_detail',
                           kwargs={'style_slug': self.style.slug, 'slug': self.article.slug})

    def test_article_detail_view(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.article.title)
        self.assertContains(response, self.article.content)
        self.assertTemplateUsed(response, 'musicians/article_detail.html')


class ArticleCreateTestCase(SetUpMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.url = reverse('musicians:article_create')
        self.client.login(**self.user_credentials)

    def test_article_create_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_article_create_post(self):
        response = self.client.post(self.url, self.post_data)
        new_article = Musician.objects.latest('id')
        self.assertIsNotNone(new_article, "New article was not created")
        self.assertEqual(new_article.title, self.post_data['title'])
        self.assertEqual(new_article.content, self.post_data['content'])
        self.assertEqual(new_article.author, self.user)
        self.assertRedirects(
            response,
            expected_url=new_article.get_absolute_url(),
            status_code=302,
            target_status_code=200
        )


class ArticleEditTestCase(SetUpMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.other_user = User.objects.create_user(username='other_user', email='other@example.com', password='54321')
        self.url = reverse(
            'musicians:article_edit',
            kwargs={'style_slug': self.style.slug, 'slug': self.article.slug}
        )
        self.client.login(**self.user_credentials)

    def test_article_edit_access_by_author(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_article_edit_access_by_non_author(self):
        self.client.login(username='other_user', password='54321')
        response = self.client.get(self.url)
        self.assertNotEqual(response.status_code, 200)

    def test_article_edit_form_submission(self):
        updated_content = 'Updated Content Updated Content Updated Content Updated Content Updated Content Updated'
        response = self.client.post(self.url, {
            'content': updated_content,
            'style': self.style.id,
            'is_published': True,
        })
        self.article.refresh_from_db()
        self.assertEqual(self.article.content, updated_content)
        self.assertRedirects(
            response,
            expected_url=self.article.get_absolute_url(),
            status_code=302,
            target_status_code=200
        )


class ArticleDeleteTestCase(SetUpMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.other_user = User.objects.create_user(username='other_user', password='54321')
        self.url = reverse(
            'musicians:article_delete',
            kwargs={'style_slug': self.style.slug, 'slug': self.article.slug}
        )
        self.client.login(**self.user_credentials)

    def test_article_delete_access_by_author(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_article_delete_access_by_non_author(self):
        self.client.login(username='other_user', password='54321')
        response = self.client.get(self.url)
        self.assertNotEqual(response.status_code, 200)

    def test_article_delete(self):
        response = self.client.post(self.url)
        self.assertRedirects(response, expected_url=reverse('musicians:home'), status_code=302, target_status_code=200)
        self.assertFalse(Musician.objects.filter(id=self.article.id).exists())


class UserArticlesFormsetViewTestCase(SetUpMixin, TestCase):
    def setUp(self):
        super().setUp()
        self.client.login(**self.user_credentials)
        self.client.post(reverse('musicians:article_create'), self.post_data)
        self.another_article = Musician.objects.latest('id')
        self.url = reverse('musicians:articles_author')

    def test_user_articles_formset_view(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('formset', response.context)
        self.assertEqual(len(response.context['formset']), 2)

    def test_user_articles_formset_submission(self):
        response = self.client.post(self.url, {
            'form-TOTAL_FORMS': '2',
            'form-INITIAL_FORMS': '2',
            'form-0-id': self.article.id,
            'form-0-is_published': False,
            'form-1-id': self.another_article.id,
            'form-1-is_published': True,
        })
        self.assertRedirects(
            response,
            expected_url=reverse('musicians:home'),
            status_code=302,
            target_status_code=200
        )
        self.article.refresh_from_db()
        self.another_article.refresh_from_db()
        self.assertFalse(self.article.is_published)
        self.assertTrue(self.another_article.is_published)


class AboutViewTestCase(TestCase):
    def test_about_page(self):
        response = self.client.get(reverse('musicians:about'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'musicians/about.html')
        self.assertContains(response, 'About')
