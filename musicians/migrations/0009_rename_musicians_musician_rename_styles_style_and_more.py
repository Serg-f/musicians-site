# Generated by Django 4.1 on 2023-12-24 16:00

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('musicians', '0008_alter_musicians_content_alter_musicians_title_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Musicians',
            new_name='Musician',
        ),
        migrations.RenameModel(
            old_name='Styles',
            new_name='Style',
        ),
        migrations.AlterModelOptions(
            name='musician',
            options={'ordering': ['-time_create']},
        ),
        migrations.AlterModelOptions(
            name='style',
            options={},
        ),
    ]
