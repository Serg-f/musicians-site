# Generated by Django 4.1 on 2023-12-24 16:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('musicians', '0009_rename_musicians_musician_rename_styles_style_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='musician',
            options={'ordering': ['-time_update']},
        ),
    ]
