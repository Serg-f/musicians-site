from django.urls import path

from musicians.views import ArticlesList, Home, About, Contact, ArticleDetail, ArticleEdit, ArticleDelete

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('style/<slug:slug>/', ArticlesList.as_view(), name='articles_list'),
    path('article/<slug:slug>/', ArticleDetail.as_view(), name='article_detail'),
    path('article/<slug:slug>/edit/', ArticleEdit.as_view(), name='article_edit'),
    path('article/<slug:slug>/delete/', ArticleDelete.as_view(), name='article_delete'),
    path('article/add/', ArticlesList.as_view(), name='article_add'),
    path('about/', About.as_view(), name='about'),
    path('contact/', Contact.as_view(), name='contact'),
]
