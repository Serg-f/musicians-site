from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .models import CustomUser
from .serializers import UserSerializer, UserPublicSerializer


@api_view(['GET'])
def validate_token(request):
    JWT_authenticator = JWTAuthentication()
    try:
        response = JWT_authenticator.authenticate(request)
        if response is not None:
            user, token = response
            return Response(UserSerializer(user).data)
    except (InvalidToken, TokenError):
        pass  # Token is invalid

    # Verify the token manually
    verify_view = TokenVerifyView.as_view()
    return verify_view(request)


class UsersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.filter(is_staff=False)
    serializer_class = UserPublicSerializer


class ProfileView(RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
