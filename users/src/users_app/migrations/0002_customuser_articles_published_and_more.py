# Generated by Django 5.0.6 on 2024-07-03 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='articles_published',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Articles published'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='articles_total',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Articles total'),
        ),
    ]
