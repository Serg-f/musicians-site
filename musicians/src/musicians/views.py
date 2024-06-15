from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from .filters import MusiciansFilter
from .models import Musician, Style
from .permissions import IsAuthorOrAdmin
from .serializers import MusicianSerializer, StyleSerializer


class FilterMixin:
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MusiciansFilter
    search_fields = ['title', 'style__name', 'content', ]
    ordering_fields = ['time_create', 'title', 'style__name']


class MusiciansViewSet(FilterMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Musician.objects.filter(is_published=True)
    serializer_class = MusicianSerializer


class StylesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer


class AuthorMusiciansViewSet(viewsets.ModelViewSet):
    serializer_class = MusicianSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrAdmin]

    def get_queryset(self):
        author_queryset = Musician.objects.filter(author_id=self.request.user.id)
        return Musician.objects.all() if self.request.user.is_staff else author_queryset
