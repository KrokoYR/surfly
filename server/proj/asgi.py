"""
ASGI config for proj project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

# Setup ASGI(async server gateway interface) for HTTP + websockets

# !IMPORTANT order of imports matters for gunicorn + uvicorn
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "proj.settings")

import django
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack

from django.core.asgi import get_asgi_application

import drawing.routing


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(drawing.routing.websocket_urlpatterns))
        )
    }
)
