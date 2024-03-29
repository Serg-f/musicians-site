# Generated by Django 4.1 on 2023-12-23 15:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('musicians', '0007_alter_musicians_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='musicians',
            name='content',
            field=models.TextField(max_length=8000, validators=[django.core.validators.MinLengthValidator(80)], verbose_name='Content'),
        ),
        migrations.AlterField(
            model_name='musicians',
            name='title',
            field=models.CharField(max_length=200, unique=True, validators=[django.core.validators.RegexValidator(message='Please enter a valid title with 3 to 30 characters.Each word should start with an uppercase letter, and only letters and single spaces between words are allowed .', regex='^[A-Z][A-Za-z]*(?:\\s[A-Z][A-Za-z]*){0,29}$')], verbose_name='Title'),
        ),
        migrations.AlterField(
            model_name='styles',
            name='name',
            field=models.CharField(max_length=100, validators=[django.core.validators.RegexValidator(message='Please enter a valid title with 3 to 30 characters.Each word should start with an uppercase letter, and only letters and single spaces between words are allowed .', regex='^[A-Z][A-Za-z]*(?:\\s[A-Z][A-Za-z]*){0,29}$')], verbose_name='Style'),
        ),
    ]
