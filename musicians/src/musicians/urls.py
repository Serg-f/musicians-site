from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MusicianViewSet, StyleViewSet

router = DefaultRouter()
router.register(r'musicians', MusicianViewSet)
router.register(r'styles', StyleViewSet)

urlpatterns = [
    path('v1/', include(router.urls)),
]