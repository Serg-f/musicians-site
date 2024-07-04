from rest_framework.permissions import BasePermission
import ipaddress
import logging

logger = logging.getLogger(__name__)


class IsFromMusiciansService(BasePermission):
    """
    Allows access only to requests from musicians-service.
    """

    def has_permission(self, request, view):
        allowed_subnet = ipaddress.ip_network('172.0.0.0/8')
        ip = request.META.get('REMOTE_ADDR')
        logger.debug(f"Request IP: {ip}")

        # Check if the request IP is in the allowed subnet
        if ipaddress.ip_address(ip) in allowed_subnet:
            return True

        return False
