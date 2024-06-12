from rest_framework import permissions

from .utils import get_user


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(get_user(request))


class IsAuthorOrAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        user = get_user(request)
        if user:
            return user['is_staff'] or obj.author_id == user['id']
        return False
