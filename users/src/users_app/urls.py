from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import validate_token, ProfileView, UsersViewSet, UserStatsViewSet, RegisterView

router = SimpleRouter()
router.register('users', UsersViewSet, basename='user')
router.register('user-stats', UserStatsViewSet, basename='user-stats')

urlpatterns = [
    path('validate-token/', validate_token),
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
]
