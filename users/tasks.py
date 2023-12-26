from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from celery import shared_task
from django.conf import settings


@shared_task
def send_email_task(title, content, username, user_email):
    subject = "Your message is received"

    # Render HTML content
    html_content = render_to_string('users/email_template.html', {
        'title': title,
        'content': content,
        'username': username,
    })
    text_content = strip_tags(html_content)  # Text version for email clients that don't support HTML

    # Create email message
    email = EmailMultiAlternatives(subject, text_content, settings.EMAIL_HOST_USER, [user_email])
    email.attach_alternative(html_content, "text/html")

    # Send the email
    email.send()
