# Generated by Django 5.0.6 on 2024-10-17 12:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('musicians', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='musician',
            options={'ordering': ['-time_create']},
        ),
    ]
