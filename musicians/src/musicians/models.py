from django.core.validators import RegexValidator, MinLengthValidator
from django.db import models
from autoslug import AutoSlugField
from embed_video.fields import EmbedVideoField
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

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


def update_user_statistic(instance):
    from .tasks import update_user_stats, update_user_stats_unshared
    # update_user_stats.delay(instance.author_id)
    update_user_stats_unshared(instance.author_id)


@receiver(post_save, sender=Musician)
def post_save_musician(sender, instance, **kwargs):
    update_user_statistic(instance)


@receiver(post_delete, sender=Musician)
def post_delete_musician(sender, instance, **kwargs):
    update_user_statistic(instance)
