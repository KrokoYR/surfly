from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/drawing/(?P<room_name>\w+)/$", consumers.DrawingConsumer.as_asgi()),
]