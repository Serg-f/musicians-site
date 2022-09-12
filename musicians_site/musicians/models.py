from django.db import models
from django.urls import reverse
from embed_video.fields import EmbedVideoField
from autoslug import AutoSlugField
import string


def auto_slug(s: str):
    s = list(s.lower().replace(' ', '-'))
    print(s)
    d = {'а': 'a', 'к': 'k', 'х': 'h', 'б': 'b', 'л': 'l', 'ц': 'c', 'в': 'v', 'м': 'm', 'ч': 'ch', 'г': 'g', 'н': 'n',
         'ш': 'sh', 'д': 'd', 'о': 'o', 'щ': 'shh', 'е': 'e', 'п': 'p', 'ё': 'jo', 'р': 'r', 'ы': 'y',
         'ж': 'zh', 'с': 's', 'з': 'z', 'т': 't', 'э': 'je', 'и': 'i', 'у': 'u', 'ю': 'ju', 'й': 'j',
         'ф': 'f', 'я': 'ya'}
    for i, symb in enumerate(s):
        s[i] = d.get(symb, symb)
    res = ''
    for symb in ''.join(s):
        if symb in string.digits + string.ascii_lowercase + '-':
            res += symb
    print(res)
    return res


class Styles(models.Model):
    name = models.CharField(max_length=100, verbose_name='Стиль')
    slug = models.SlugField(max_length=100, unique=True, db_index=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('styles', args=[self.slug])

    class Meta:
        verbose_name = 'Музыкальный стиль'
        verbose_name_plural = 'Музыкальные стили'
        ordering = ['pk']


class Musicians(models.Model):
    title = models.CharField(max_length=200, verbose_name='Заголовок', unique=True)
    slug = AutoSlugField(populate_from='title', unique_with='title', db_index=True, slugify=auto_slug, editable=True, blank=True)
    content = models.TextField(verbose_name='Содержание')
    photo = models.ImageField(upload_to='photos/%Y/%m/%d/', verbose_name='Фото')
    time_create = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    time_update = models.DateTimeField(auto_now=True, verbose_name='Изменён')
    is_published = models.BooleanField(default=True, verbose_name='Публикация')
    style = models.ForeignKey(Styles, on_delete=models.CASCADE, verbose_name='Стиль')
    video = EmbedVideoField(verbose_name='Ссылка на видео')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('post', args=[self.slug])

    class Meta:
        verbose_name = 'Известные музыканты'
        verbose_name_plural = 'Известные музыканты'
        ordering = ['-time_update']
