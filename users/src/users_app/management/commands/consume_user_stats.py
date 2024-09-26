import time
import pika
import json
from django.core.management.base import BaseCommand
from users_app.models import CustomUser

class Command(BaseCommand):
    help = 'Consume messages from the user_statistics queue'

    def handle(self, *args, **kwargs):
        retries = 5
        while retries > 0:
            try:
                connection = pika.BlockingConnection(
                    pika.ConnectionParameters(
                        host='rabbitmq',
                        port=5672,
                        connection_attempts=5,
                        retry_delay=5
                    )
                )
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
                break
            except pika.exceptions.AMQPConnectionError as e:
                self.stdout.write(self.style.ERROR(f'Connection failed: {e}'))
                retries -= 1
                time.sleep(5)
        if retries == 0:
            self.stdout.write(self.style.ERROR('Failed to connect to RabbitMQ after several attempts'))
