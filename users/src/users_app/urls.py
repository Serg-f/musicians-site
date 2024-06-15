from django.urls import path

from .views import validate_token, UsersView, ProfileView

urlpatterns = [
    path('validate-token/', validate_token),
    path('users/', UsersView.as_view()),
    path('profile/', ProfileView.as_view()),
]
