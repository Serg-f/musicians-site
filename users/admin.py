from django.contrib import admin
from .models import Message


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
