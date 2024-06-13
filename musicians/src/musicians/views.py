from rest_framework import viewsets, mixins
from .models import Musician, Style
from .permissions import IsAuthorOrAdminOrReadOnly
from .serializers import MusicianSerializer, StyleSerializer


class MusicianViewSet(viewsets.ModelViewSet):
    queryset = Musician.objects.filter(is_published=True)
    serializer_class = MusicianSerializer
    permission_classes = [IsAuthorOrAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author_id=self.request.user.id)


class StyleViewSet(mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):
    queryset = Style.objects.all()
    serializer_class = StyleSerializer
