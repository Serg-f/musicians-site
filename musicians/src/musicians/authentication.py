import logging

from rest_framework import authentication, exceptions
from urllib.request import urlopen, Request as URLRequest
from urllib.error import HTTPError

from mus_proj.settings import USERS_SERVICE_URL
from .serializers import UserSerializer
import json

logger = logging.getLogger(__name__)


class CustomTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        logger.debug(f"Auth Header: {auth_header}")  # Debug log
        if not auth_header:
            return None

        try:
            auth_request = URLRequest(f'{USERS_SERVICE_URL}/validate-token/',
                                      headers={'Authorization': auth_header})
            logger.debug(f"Auth Request: {auth_request.headers}")  # Debug log
            logger.debug(f"Auth Request URL: {auth_request.full_url}")  # Debug log
            with urlopen(auth_request) as response:
                data = json.loads(response.read())
                logger.debug(f"Response Data: {data}")  # Debug log
                user_serializer = UserSerializer(data=data)
                if user_serializer.is_valid():
                    validated_data = user_serializer.validated_data
                    logger.debug(f"Validated Data: {validated_data}")  # Debug log
                    user = user_serializer.create_user(validated_data)
                    request.user = user
                    logger.debug(f"Authenticated User: {request.user}")  # Debug log
                    return user, None
                else:
                    logger.warning(f"User Serializer Errors: {user_serializer.errors}")  # Warning log
        except HTTPError as e:
            logger.warning(f"HTTPError: {e}")  # Warning log
            if e.code == 401:
                raise exceptions.AuthenticationFailed(json.loads(e.read()))
            else:
                raise exceptions.AuthenticationFailed('Unexpected error occurred during authentication')

        return None
