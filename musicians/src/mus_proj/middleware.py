from django.utils.deprecation import MiddlewareMixin

class DebugMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        print(f"User: {request.user}")
        print(f"User is authenticated: {request.user.is_authenticated}")
        return response
