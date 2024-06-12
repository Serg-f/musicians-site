from rest_framework import viewsets, mixins
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .authentication import CustomTokenAuthentication
from .models import Musician, Style
from .permissions import IsAuthorOrAdminOrReadOnly
from .serializers import MusicianSerializer, StyleSerializer


class MusicianViewSet(viewsets.ModelViewSet):
    queryset = Musician.objects.filter(is_published=True)
    serializer_class = MusicianSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CustomTokenAuthentication]

class StyleViewSet(mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer


@api_view(['GET'])
def user_info(request):
    user = request.user
    print(f"Authenticated user: {user}")
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_authenticated": user.is_authenticated,
    })
