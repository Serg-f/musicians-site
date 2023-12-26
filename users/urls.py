from django.urls import path

from users.views import ContactView
app_name = 'users'

urlpatterns = [
    path('contact/', ContactView.as_view(), name='contact'),
]
