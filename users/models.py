from django.contrib.auth import get_user_model
from django.db import models
from .tasks import send_email_task


class Message(models.Model):
    title = models.CharField(max_length=100, verbose_name='Title')
    message = models.TextField(max_length=1000)
    photo = models.ImageField(upload_to='user_message_image/%Y/%m/%d/', verbose_name='Image', blank=True)
    datetime = models.DateTimeField(auto_now_add=True, verbose_name='Created')
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, verbose_name='User')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        send_email_task.delay(self.title, self.message, self.user.username, self.user.email)

    def __str__(self):
        return self.title
