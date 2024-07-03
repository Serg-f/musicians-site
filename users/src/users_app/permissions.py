from rest_framework.permissions import BasePermission


class IsFromMusiciansService(BasePermission):
    """
    Allows access only to requests from musicians-service.
    """
    def has_permission(self, request, view):
        allowed_ips = ['musicians-service', '172.18.0.1']  # Add localhost for internal testing
        ip = request.META.get('REMOTE_ADDR')
        print(f"Request IP: {ip}")
        return ip in allowed_ips
