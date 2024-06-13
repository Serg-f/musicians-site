from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MusiciansViewSet, StylesViewSet, AuthorMusiciansViewSet

router = DefaultRouter()
router.register(r'musicians', MusiciansViewSet)
router.register(r'styles', StylesViewSet)
router.register(r'author/musicians', AuthorMusiciansViewSet, basename='author-musicians')

urlpatterns = [
    path('v1/', include(router.urls)),
]