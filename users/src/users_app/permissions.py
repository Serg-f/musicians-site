from rest_framework.permissions import BasePermission
import ipaddress
import logging

logger = logging.getLogger(__name__)

class IsFromMusiciansService(BasePermission):
    """
    Allows access only to requests from specified subnets.
    """

    def has_permission(self, request, view):
        allowed_subnets = [
            ipaddress.ip_network('172.0.0.0/8'),
            ipaddress.ip_network('169.254.0.0/16')  # Add additional subnets here
        ]
        ip = request.META.get('REMOTE_ADDR')
        logger.debug(f"Request IP: {ip}")

        # Check if the request IP is in any of the allowed subnets
        for subnet in allowed_subnets:
            if ipaddress.ip_address(ip) in subnet:
                return True

        return False