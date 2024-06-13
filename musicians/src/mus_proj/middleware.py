import logging

from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class DebugMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        logger.debug(f"Middleware debug. User: {request.user}")
        logger.debug(f"Middleware debug. User is authenticated: {request.user.is_authenticated}")
        return response
