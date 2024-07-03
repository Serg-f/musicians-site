from celery import Celery
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mus_proj.settings')

app = Celery('mus_proj')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
