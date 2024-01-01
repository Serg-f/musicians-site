"""
Django settings for musicians_site project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
import json
import os
import sys
from pathlib import Path
import environ
import os

env = environ.Env(
    SECRET_KEY=str,

    # database settings
    DB_NAME=str,
    DB_USER=str,
    DB_PASSWORD=str,
    DB_HOST=str,
    DB_PORT=int,

    # email settings
    EMAIL_HOST=str,
    EMAIL_PORT=int,
    EMAIL_HOST_USER=str,
    EMAIL_HOST_PASSWORD=str,
    EMAIL_USE_TLS=bool,
    EMAIL_USE_SSL=bool,

    # celery settings
    CELERY_BROKER_URL=str,
    CELERY_RESULT_BACKEND=str,
    CELERY_ACCEPT_CONTENT=str,
    CELERY_TASK_SERIALIZER=str,
    CELERY_RESULT_SERIALIZER=str,
    CELERY_TIMEZONE=str,

    # django-allauth settings
    ACCOUNT_EMAIL_REQUIRED=bool,
    ACCOUNT_USERNAME_REQUIRED=bool,
    ACCOUNT_AUTHENTICATION_METHOD=str,
    ACCOUNT_EMAIL_VERIFICATION=str,
    ACCOUNT_MAX_EMAIL_ADDRESSES=int,
    ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION=bool,
    ACCOUNT_USERNAME_BLACKLIST=str,
    ACCOUNT_USERNAME_MIN_LENGTH=int,
    ACCOUNT_USERNAME_MAX_LENGTH=int,
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Take environment variables from .env file
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [
    # django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # third-party apps
    'embed_video',
    'captcha',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'crispy_forms',
    'crispy_bootstrap4',
    # 'debug_toolbar',

    # local apps
    'musicians.apps.MusiciansConfig',
    'users.apps.UsersConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # "debug_toolbar.middleware.DebugToolbarMiddleware",

    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'musicians_site.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

AUTHENTICATION_BACKENDS = [
    # Needed to log in by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by email
    'allauth.account.auth_backends.AuthenticationBackend',
]

WSGI_APPLICATION = 'musicians_site.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env("DB_PASSWORD"),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = ['static']

MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

INTERNAL_IPS = [
    "127.0.0.1",
]


if 'test' in sys.argv:
    CAPTCHA_TEST_MODE = True


AUTH_USER_MODEL = 'users.CustomUser'

LOGIN_REDIRECT_URL = 'musicians:home'

# email settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env('EMAIL_PORT')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = env('EMAIL_USE_TLS')
EMAIL_USE_SSL = env('EMAIL_USE_SSL')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Celery Configuration
CELERY_BROKER_URL = env('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND')
CELERY_ACCEPT_CONTENT = json.loads(env('CELERY_ACCEPT_CONTENT', default='["application/json"]'))
CELERY_TASK_SERIALIZER = env('CELERY_TASK_SERIALIZER')
CELERY_RESULT_SERIALIZER = env('CELERY_RESULT_SERIALIZER')
CELERY_TIMEZONE = env('CELERY_TIMEZONE')

# django-allauth settings
ACCOUNT_EMAIL_REQUIRED = env('ACCOUNT_EMAIL_REQUIRED')
ACCOUNT_USERNAME_REQUIRED = env('ACCOUNT_USERNAME_REQUIRED')
ACCOUNT_AUTHENTICATION_METHOD = env('ACCOUNT_AUTHENTICATION_METHOD')
ACCOUNT_EMAIL_VERIFICATION = env('ACCOUNT_EMAIL_VERIFICATION')
ACCOUNT_MAX_EMAIL_ADDRESSES = env('ACCOUNT_MAX_EMAIL_ADDRESSES')
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = env('ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION')
ACCOUNT_USERNAME_BLACKLIST = json.loads(env('ACCOUNT_USERNAME_BLACKLIST'))
ACCOUNT_USERNAME_MIN_LENGTH = env('ACCOUNT_USERNAME_MIN_LENGTH')
ACCOUNT_USERNAME_MAX_LENGTH = env('ACCOUNT_USERNAME_MAX_LENGTH')

# crispy forms settings
CRISPY_TEMPLATE_PACK = 'bootstrap4'
