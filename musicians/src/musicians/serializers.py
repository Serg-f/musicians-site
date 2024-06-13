from rest_framework import serializers

from .models import Musician, Style


class MusicianSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Musician
        fields = ('url', 'id', 'title', 'slug', 'content', 'photo', 'time_create', 'time_update', 'is_published',
                  'style', 'video', 'author_id')
        read_only_fields = ('slug', 'time_create', 'time_update', 'author_id')


class StyleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Style
        fields = ('url', 'id', 'name', 'slug')


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField(allow_blank=True)
    last_name = serializers.CharField(allow_blank=True)
    is_staff = serializers.BooleanField()
    last_login = serializers.DateTimeField()

    def create_user(self, validated_data):
        class User:
            def __init__(self, **kwargs):
                for key, value in kwargs.items():
                    setattr(self, key, value)

            @property
            def is_authenticated(self):
                return True

            def __str__(self):
                return self.username

        return User(**validated_data)
