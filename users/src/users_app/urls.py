from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import ProfileView, UsersViewSet, RegisterView

router = SimpleRouter()
router.register('users', UsersViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
]
