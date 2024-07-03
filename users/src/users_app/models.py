from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, verbose_name='Email')
    articles_published = models.PositiveSmallIntegerField(default=0, verbose_name='Articles published')
    articles_total = models.PositiveSmallIntegerField(default=0, verbose_name='Articles total')
