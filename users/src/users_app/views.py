from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializers import UserProfileSerializer, UserPublicSerializer, RegisterSerializer, \
    CustomTokenObtainPairSerializer



class UsersViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.filter(is_staff=False)
    serializer_class = UserPublicSerializer


class ProfileView(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

