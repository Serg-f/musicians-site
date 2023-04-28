from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import *
from embed_video.admin import AdminVideoMixin


class MusiciansAdmin(AdminVideoMixin, admin.ModelAdmin):
    list_display = ('id', 'title', 'get_html_photo', 'style', 'time_update', 'is_published')
    list_display_links = ('title',)
    search_fields = ('title', 'content')
    list_editable = ('is_published',)
    list_filter = ('is_published', 'style', 'time_update')
    # prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('time_create', 'time_update', 'get_html_photo_edit')
    fields = ('title', 'content', 'style', 'photo', 'get_html_photo_edit', 'video', 'is_published', 'time_create', 'time_update')
    save_on_top = True

    def get_html_photo(self, object):
        if object.photo:
            return mark_safe(f"<img src='{object.photo.url}' width=50")

    def get_html_photo_edit(self, object):
        if object.photo:
            return mark_safe(f"<img src='{object.photo.url}' width=200")

    get_html_photo.short_description = 'Photo'
    get_html_photo_edit.short_description = 'Photo preview'



admin.site.register(Musicians, MusiciansAdmin)


class StylesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('name',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


admin.site.register(Styles, StylesAdmin)
