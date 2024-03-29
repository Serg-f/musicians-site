from django.core.validators import RegexValidator, MinLengthValidator
from django.db import models
from django.urls import reverse
from embed_video.fields import EmbedVideoField
from autoslug import AutoSlugField

from musicians_site.settings import AUTH_USER_MODEL

TitleValidator = RegexValidator(regex=r'^[A-Z][A-Za-z]*(?:\s[A-Z][A-Za-z]*){0,29}$',
                                message='Please enter a valid title with 3 to 30 characters.'
                                        'Each word should start with an uppercase letter, and only letters and single'
                                        ' spaces between words are allowed .')


class Style(models.Model):
    name = models.CharField(max_length=100, validators=[TitleValidator], verbose_name='Style')
    slug = models.SlugField(max_length=100, unique=True, db_index=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('musicians:articles_list', args=[self.slug])


class Musician(models.Model):
    title = models.CharField(max_length=200, unique=True, validators=[TitleValidator], verbose_name='Title')
    slug = AutoSlugField(populate_from='title', unique=True, db_index=True)
    content = models.TextField(verbose_name='Content', max_length=8000, validators=[MinLengthValidator(80)])
    photo = models.ImageField(upload_to='photos/%Y/%m/%d/', verbose_name='Photo', blank=True)
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Created')
    time_update = models.DateTimeField(auto_now=True, verbose_name='Updated')
    is_published = models.BooleanField(default=True, verbose_name='Publishing')
    style = models.ForeignKey(Style, on_delete=models.CASCADE, verbose_name='Style')
    video = EmbedVideoField(verbose_name='Link for video', blank=True)
    author = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Author')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('musicians:article_detail', args=[self.style.slug, self.slug])

    class Meta:
        ordering = ['-time_update']

