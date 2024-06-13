from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Musician, Style
from .permissions import IsAuthorOrAdmin
from .serializers import MusicianSerializer, StyleSerializer


class MusiciansViewSet(ReadOnlyModelViewSet):
    queryset = Musician.objects.filter(is_published=True)
    serializer_class = MusicianSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class StylesViewSet(ReadOnlyModelViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer


class AuthorMusiciansViewSet(viewsets.ModelViewSet):
    serializer_class = MusicianSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrAdmin]

    def get_queryset(self):
        author_queryset = Musician.objects.filter(author_id=self.request.user.id)
        return Musician.objects.all() if self.request.user.is_staff else author_queryset
