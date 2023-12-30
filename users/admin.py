from django.contrib import admin
from .models import Message, CustomUser


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('title', 'datetime', 'user')
    list_filter = ('datetime', 'user')
    search_fields = ('title', 'message')
    readonly_fields = ('datetime', 'user')
    fields = ('title', 'message', 'photo', 'datetime', 'user')
    list_display_links = ('title', 'datetime')
    list_per_page = 20
    date_hierarchy = 'datetime'


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    readonly_fields = ('last_login', 'date_joined')
    fields = ('username', 'email', 'first_name', 'last_name', 'password', 'is_staff', 'is_active', 'last_login',
              'date_joined')
    list_display_links = ('username', 'email')
    list_per_page = 20
    date_hierarchy = 'date_joined'
