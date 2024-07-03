from celery import shared_task


@shared_task
def update_user_stats():
    print('Update user stats')
