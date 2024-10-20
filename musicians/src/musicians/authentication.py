import logging

from rest_framework import authentication

from .serializers import UserSerializer

logger = logging.getLogger(__name__)


class CustomTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        logger.debug('Starting authentication process.')

        user_id = request.headers.get('X-User-ID')
        if not user_id:
            logger.debug('No User ID found in request headers.')
            return None

        logger.debug(f'User ID found: {user_id}')

        user_serializer = UserSerializer(data={'id': user_id})

        if user_serializer.is_valid():
            logger.debug('User serializer is valid. Creating user.')
            return user_serializer.create_user(user_serializer.validated_data), None
        else:
            logger.debug(f'User serializer is invalid. Errors: {user_serializer.errors}')
            return None
