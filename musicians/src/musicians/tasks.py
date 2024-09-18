
import requests
import logging
from celery import shared_task

from mus_proj.settings import USERS_SERVICE_URL
from .models import Musician
from .serializers import UserStatsSerializer

logger = logging.getLogger(__name__)

@shared_task
def update_user_stats(user_id):
    user_articles = Musician.objects.filter(author_id=user_id)
    article_total = user_articles.count()
    article_published = user_articles.filter(is_published=True).count()
    user_statistic = {
        'id': user_id,
        'articles_published': article_published,
        'articles_total': article_total
    }
    # Send user statistics to the users service via message broker


@shared_task
def update_all_users_stats():
    user_ids = Musician.objects.values_list('author_id', flat=True).distinct()
    for user_id in user_ids:
        update_user_stats.delay(user_id)
