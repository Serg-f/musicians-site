from rest_framework import authentication, exceptions
from urllib.request import urlopen, Request as URLRequest
from urllib.error import HTTPError
from .serializers import UserSerializer
import json


class CustomTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        print(f"Auth Header: {auth_header}")  # Debug print
        if not auth_header:
            return None

        try:
            auth_request = URLRequest('http://users-service:8000/validate-token/',
                                      headers={'Authorization': auth_header})
            with urlopen(auth_request) as response:
                data = json.loads(response.read())
                print(f"Response Data: {data}")  # Debug print
                user_serializer = UserSerializer(data=data)
                if user_serializer.is_valid():
                    validated_data = user_serializer.validated_data
                    print(f"Validated Data: {validated_data}")  # Debug print
                    user = user_serializer.create_user(validated_data)
                    request.user = user
                    print(f"Authenticated User: {request.user}")  # Debug print
                    return user, None
                else:
                    print(f"User Serializer Errors: {user_serializer.errors}")  # Debug print
        except HTTPError as e:
            print(f"HTTPError: {e}")  # Debug print
            if e.code == 401:
                raise exceptions.AuthenticationFailed(json.loads(e.read()))
            else:
                raise exceptions.AuthenticationFailed('Unexpected error occurred during authentication')

        return None
