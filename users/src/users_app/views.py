from rest_framework import viewsets, mixins
from rest_framework.decorators import api_view
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .permissions import IsFromMusiciansService
from .serializers import UserProfileSerializer, UserPublicSerializer, UserStatsSerializer, RegisterSerializer, \
    CustomTokenObtainPairSerializer


@api_view(['GET'])
def validate_token(request):
    JWT_authenticator = JWTAuthentication()
    try:
        response = JWT_authenticator.authenticate(request)
        if response is not None:
            user, token = response
            return Response(UserProfileSerializer(user).data)
    except (InvalidToken, TokenError):
        pass  # Token is invalid

    # Verify the token manually
    verify_view = TokenVerifyView.as_view()
    return verify_view(request)


class UsersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.filter(articles_published__gt=0)
    serializer_class = UserPublicSerializer


class ProfileView(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserStatsViewSet(mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin,
                       mixins.ListModelMixin,
                       viewsets.GenericViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserStatsSerializer
    permission_classes = [IsFromMusiciansService]


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
