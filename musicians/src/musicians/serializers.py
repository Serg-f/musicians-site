from django.conf import settings
from rest_framework import serializers
from urllib3 import request

from .models import Musician, Style


class MusicianSerializer(serializers.HyperlinkedModelSerializer):
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Musician
        fields = ('url', 'id', 'title', 'slug', 'content', 'photo', 'time_create', 'time_update', 'is_published',
                  'style', 'video', 'author_id')
        read_only_fields = ('slug', 'time_create', 'time_update', 'author_id')

    def get_photo(self, obj):
        if obj.photo:
            return f"{settings.MEDIA_URL}{obj.photo}"
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author_id'] = request.user.id

        # Handle file uploads
        photo = request.FILES.get('photo')
        if photo:
            validated_data['photo'] = photo

        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Handle the image update
        request = self.context.get('request')
        photo = request.FILES.get('photo')
        if photo:
            validated_data['photo'] = photo
        return super().update(instance, validated_data)


class StyleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Style
        fields = ('url', 'id', 'name', 'slug')


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()

    def create_user(self, validated_data):
        class User:
            def __init__(self, **kwargs):
                for key, value in kwargs.items():
                    setattr(self, key, value)

            @property
            def is_authenticated(self):
                return True

            def __str__(self):
                username = getattr(self, 'username', None)
                return f'user_id: {self.id}, username: {username}'

        return User(**validated_data)
