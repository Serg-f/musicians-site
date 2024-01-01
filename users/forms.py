from captcha.fields import CaptchaField
from django import forms
from django.conf import settings

from users.models import Message


class ContactForm(forms.ModelForm):
    captcha = CaptchaField()

    class Meta:
        model = Message
        fields = ['title', 'message', 'photo']
