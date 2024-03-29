# Generated by Django 4.1 on 2022-09-12 18:56

import autoslug.fields
from django.db import migrations, models
import django.db.models.deletion
import embed_video.fields
import musicians.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Styles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Стиль')),
                ('slug', models.SlugField(max_length=100, unique=True)),
            ],
            options={
                'verbose_name': 'Музыкальный стиль',
                'verbose_name_plural': 'Музыкальные стили',
                'ordering': ['pk'],
            },
        ),
        migrations.CreateModel(
            name='Musicians',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, unique=True, verbose_name='Заголовок')),
                ('slug', autoslug.fields.AutoSlugField(blank=True, editable=True, populate_from='title', unique_with=('title',))),
                ('content', models.TextField(verbose_name='Содержание')),
                ('photo', models.ImageField(upload_to='photos/%Y/%m/%d/', verbose_name='Фото')),
                ('time_create', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('time_update', models.DateTimeField(auto_now=True, verbose_name='Изменён')),
                ('is_published', models.BooleanField(default=True, verbose_name='Публикация')),
                ('video', embed_video.fields.EmbedVideoField(verbose_name='Ссылка на видео')),
                ('style', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='musicians.styles', verbose_name='Стиль')),
            ],
            options={
                'verbose_name': 'Известные музыканты',
                'verbose_name_plural': 'Известные музыканты',
                'ordering': ['-time_update'],
            },
        ),
    ]
