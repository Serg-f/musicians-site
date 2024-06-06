from rest_framework.generics import ListAPIView

from users.serializers import UserSerializer
from users_app.models import CustomUser


class UsersView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
