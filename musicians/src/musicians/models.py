import json

import pika
from autoslug import AutoSlugField
from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from embed_video.fields import EmbedVideoField

TitleValidator = RegexValidator(regex=r'^[A-Z][A-Za-z]*(?:\s[A-Z][A-Za-z]*){0,29}$',
                                message='Please enter a valid title with 3 to 30 characters.'
                                        'Each word should start with an uppercase letter, and only letters and single'
                                        ' spaces between words are allowed .')


class Style(models.Model):
    name = models.CharField(max_length=100, validators=[TitleValidator], verbose_name='Style')
    slug = models.SlugField(max_length=100, unique=True, db_index=True)

    def __str__(self):
        return self.name


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
    author_id = models.PositiveIntegerField()

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-time_create']


def send_user_stat_update(user_id):
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    channel.queue_declare(queue='user_statistics')

    user_articles = Musician.objects.filter(author_id=user_id)
    article_total = user_articles.count()
    article_published = user_articles.filter(is_published=True).count()

    message = json.dumps({
        'user_id': user_id,
        'articles_published': article_published,
        'articles_total': article_total
    })

    channel.basic_publish(exchange='', routing_key='user_statistics', body=message)
    connection.close()


@receiver(post_save, sender=Musician)
def post_save_musician(sender, instance, **kwargs):
    send_user_stat_update(instance.author_id)


@receiver(post_delete, sender=Musician)
def post_delete_musician(sender, instance, **kwargs):
    send_user_stat_update(instance.author_id)
