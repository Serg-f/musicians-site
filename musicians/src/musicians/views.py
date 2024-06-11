from django.shortcuts import render
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Musician, Style
from .serializers import MusicianSerializer, StyleSerializer


class MusicianViewSet(viewsets.ModelViewSet):
    queryset = Musician.objects.filter(is_published=True)
    serializer_class = MusicianSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class StyleViewSet(mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer
