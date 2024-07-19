import requests
import logging
from celery import shared_task

from mus_proj.settings import USERS_SERVICE_URL
from .models import Musician
from .serializers import UserStatsSerializer

logger = logging.getLogger(__name__)


def handle_user_stats(user):
    user_articles = Musician.objects.filter(author_id=user['id'])
    article_total_computed = user_articles.count()
    article_published_computed = user_articles.filter(is_published=True).count()
    if (user['articles_total'] != article_total_computed or
            user['articles_published'] != article_published_computed):

        user['articles_total'] = article_total_computed
        user['articles_published'] = article_published_computed
        try:
            response = requests.patch(f'{USERS_SERVICE_URL}/user-stats/{user["id"]}/', json=user)
            response.raise_for_status()
        except requests.RequestException as e:
            logger.error(f"Request error: {e}")


@shared_task
def update_all_users_stats():
    data = []
    try:
        response = requests.get(f'{USERS_SERVICE_URL}/user-stats/')
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        logger.error(f"Request error: {e}")

    serializer = UserStatsSerializer(data=data, many=True)
    if serializer.is_valid():
        for user in serializer.validated_data:
            handle_user_stats(user)
    else:
        logger.error(f"Serializer errors: {serializer.errors}")


@shared_task
def update_user_stats(user_id):
    try:
        response = requests.get(f'{USERS_SERVICE_URL}/user-stats/{user_id}/')
        response.raise_for_status()
        user = response.json()
    except requests.RequestException as e:
        logger.error(f"Request error: {e}")
    else:
        handle_user_stats(user)
