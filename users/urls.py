from django.urls import path

from users.views import ContactView, UserProfileView

app_name = 'users'

urlpatterns = [
    path('contact/', ContactView.as_view(), name='contact'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]
