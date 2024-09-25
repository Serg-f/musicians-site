import pika
import json
from django.core.management.base import BaseCommand
from users_app.models import CustomUser

class Command(BaseCommand):
    help = 'Consume messages from the user_statistics queue'

    def handle(self, *args, **kwargs):
        connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
        channel = connection.channel()
        channel.queue_declare(queue='user_statistics')

        def callback(ch, method, properties, body):
            message = json.loads(body)
            user_id = message['user_id']
            articles_published = message['articles_published']
            articles_total = message['articles_total']

            try:
                user = CustomUser.objects.get(id=user_id)
                user.articles_published = articles_published
                user.articles_total = articles_total
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully updated stats for user {user_id}'))
            except CustomUser.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'User {user_id} does not exist'))

        channel.basic_consume(queue='user_statistics', on_message_callback=callback, auto_ack=True)
        self.stdout.write(self.style.SUCCESS('Starting to consume messages from user_statistics queue'))
        channel.start_consuming()
