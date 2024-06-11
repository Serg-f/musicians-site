from rest_framework import serializers

from .models import Musician, Style


class MusicianSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Musician
        fields = ('url', 'id', 'title', 'slug', 'content', 'photo', 'time_create', 'time_update', 'is_published',
                  'style', 'video', 'author_id')
        readonly_fields = ('slug', 'time_create', 'time_update', 'author_id')


class StyleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Style
        fields = ('url', 'id', 'name', 'slug')
