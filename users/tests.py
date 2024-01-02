from django.conf import settings
from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
from users.models import CustomUser, Message


class ContactViewTestCase(TestCase):

    def setUp(self):
        self.url = reverse('users:contact')
        self.user = CustomUser.objects.create_user(username='testuser', password='12345')

    def test_login_required(self):
        response = self.client.get(self.url)
        self.assertNotEqual(response.status_code, 200)

    def test_form_submission(self):
        self.client.login(username='testuser', password='12345')
        form_data = {
            'title': 'Test',
            'message': 'This is a test message',
            'captcha_0': 'dummy-value',
            'captcha_1': 'PASSED'
        }

        def save(self, *args, **kwargs):
            super(Message, self).save(*args, **kwargs)

        Message.save = save
        response = self.client.post(self.url, form_data)
        self.assertEqual(response.status_code, 302)

    @patch('users.tasks.send_email_task.delay')
    def test_email_task_called(self, mock_send_email_task):
        self.client.login(username='testuser', password='12345')
        form_data = {
            'title': 'Test',
            'message': 'This is a test message',
            'captcha_0': 'dummy-value',
            'captcha_1': 'PASSED'
        }
        self.client.post(self.url, form_data)
        mock_send_email_task.assert_called_once()


class UserProfileViewTestCase(TestCase):

    def setUp(self):
        self.client = Client()
        self.url = reverse('users:profile')
        self.user = CustomUser.objects.create_user(username='testuser', password='12345')

    def test_access_profile_page(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_context_data(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.get(self.url)
        self.assertEqual(response.context['title'], 'User Profile')
        self.assertEqual(response.context['articles_published_count'], 0)
        self.assertEqual(response.context['articles_total_count'], 0)


class MessageModelTestCase(TestCase):

    @patch('users.models.send_email_task.delay')
    def test_send_email_on_save(self, mock_send_email_task):
        user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='12345')
        message = Message.objects.create(title='Test Title', message='Test Message', user=user)
        mock_send_email_task.assert_called_once_with(message.title, message.message, user.username, user.email)
