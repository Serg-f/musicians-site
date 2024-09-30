from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AuthorMusiciansViewSet, MusiciansViewSet, StylesViewSet

router = DefaultRouter()
router.register(r'musicians', MusiciansViewSet)
router.register(r'styles', StylesViewSet)
router.register(r'author/musicians', AuthorMusiciansViewSet, basename='author-musicians')

urlpatterns = [
    path('v1/', include(router.urls)),
]
