from rest_framework import serializers

from users_app.models import CustomUser


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'last_login', 'date_joined',
                  'articles_published', 'articles_total')


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta(UserProfileSerializer.Meta):
        model = CustomUser
        fields = ('id', 'username',)


class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'articles_published', 'articles_total')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
