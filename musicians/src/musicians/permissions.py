from rest_framework import permissions


class IsAuthorOrAdmin(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if view.action == 'update' or view.action == 'partial_update':
            return obj.author_id == request.user.id
        return obj.author_id == request.user.id or request.user.is_staff
