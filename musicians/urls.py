from django.urls import path
from musicians.views import (ArticlesList, About, Contact, ArticleDetail, ArticleEdit, ArticleDelete, ArticleCreate,
                             UserArticlesFormsetView)

app_name = 'musicians'

urlpatterns = [
    path('', ArticlesList.as_view(), name='home'),
    path('articles/style/<slug:slug>/', ArticlesList.as_view(), name='articles_list'),
    path('articles/user/', UserArticlesFormsetView.as_view(), name='articles_user'),
    path('article/<slug:style_slug>/<slug:slug>/detail/', ArticleDetail.as_view(), name='article_detail'),
    path('article/<slug:style_slug>/<slug:slug>/edit/', ArticleEdit.as_view(), name='article_edit'),
    path('article/<slug:style_slug>/<slug:slug>/delete/', ArticleDelete.as_view(), name='article_delete'),
    path('article/add/', ArticleCreate.as_view(), name='article_create'),
    path('about/', About.as_view(), name='about'),
    path('contact/', Contact.as_view(), name='contact'),
]
