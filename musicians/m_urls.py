from django.urls import path
from .views import *

urlpatterns = [
    path('admin/musicians/musicians/', show_admin, name='admin'),
    path('', ShowIndex.as_view(), name="home"),
    path('add/', AddArticle.as_view(), name='add_article'),
    path('contact/', Contact.as_view(), name='contact'),
    path('about/', about, name='about'),
    path('login/', LoginUser.as_view(), name='login'),
    path('login_add/', LoginUserAddArt.as_view(), name='login_add_art'),
    path('logout/', LogoutUser.as_view(), name='logout'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('post/<slug:post_slug>/', ShowPost.as_view(), name='post'),
    path('styles/<slug:style_slug>/', ShowStyles.as_view(), name='styles')
]