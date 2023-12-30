from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db import models

from musicians_site.settings import AUTH_USER_MODEL
from .tasks import send_email_task


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, verbose_name='Email')


class Message(models.Model):
    title = models.CharField(max_length=100, verbose_name='Title')
    message = models.TextField(max_length=1000)
    photo = models.ImageField(upload_to='user_message_image/%Y/%m/%d/', verbose_name='Image', blank=True)
    datetime = models.DateTimeField(auto_now_add=True, verbose_name='Created')
    user = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='User')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        send_email_task.delay(self.title, self.message, self.user.username, self.user.email)

    def __str__(self):
        return self.title
