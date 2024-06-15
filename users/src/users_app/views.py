from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenVerifyView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .models import CustomUser
from .serializers import UserSerializer


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


class UsersView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class ProfileView(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
