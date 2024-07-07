from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from .filters import MusiciansFilter, AuthorMusiciansFilter
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
    page_size_query_param = 'page_size'

    def get_queryset(self):
        queryset = cache.get('musicians_queryset')
        if queryset is None:
            queryset = self.queryset
            cache.set('musicians_queryset', queryset, 60 * 60 * 2)
        return queryset


class StylesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer
    pagination_class = None

    @method_decorator(cache_page(60 * 60 * 2))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


class AuthorMusiciansViewSet(FilterMixin, viewsets.ModelViewSet):
    serializer_class = MusicianSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrAdmin]
    filterset_class = AuthorMusiciansFilter

    def get_queryset(self):
        queryset = cache.get('author_musicians_queryset')
        if queryset is None:
            author_queryset = Musician.objects.filter(author_id=self.request.user.id)
            queryset = Musician.objects.all() if self.request.user.is_staff else author_queryset
            cache.set('author_musicians_queryset', queryset, 60 * 60 * 2)
        return queryset

    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            cache.delete('musicians_queryset')
            cache.delete('author_musicians_queryset')
        return response
