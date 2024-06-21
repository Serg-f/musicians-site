from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import validate_token, ProfileView, UsersViewSet

router = SimpleRouter()
router.register('users', UsersViewSet, basename='user')

urlpatterns = [
    path('validate-token/', validate_token),
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view()),
]
