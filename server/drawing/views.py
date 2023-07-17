import os
import time

from django.http import FileResponse, HttpResponseBadRequest, HttpResponseNotFound, HttpResponse
from django.views import View
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

class ImageView(View):
    def get(self, request, *args, **kwargs):
        print(request)
        image_id = request.GET.get('id')
        if image_id:
            image_path = os.path.join(settings.BASE_DIR, 'images', f'{image_id}.jpg')  # adjust this as necessary
            if os.path.isfile(image_path):
                response = FileResponse(open(image_path, 'rb'), content_type='image/jpeg')
                return response
            else:
                return HttpResponseNotFound("Image not found")
        else:
            return HttpResponseBadRequest("id parameter is required")
        
    def post(self, request, *args, **kwargs):
        # get the file from the request
        img = request.FILES.get('img')

        # check if an image file was provided
        if img:
            # build the path for the image file
            # image_id could be a timestamp or a UUID for uniqueness
            image_id = str(int(time.time()))
            image_path = os.path.join('path', 'to', 'images', f'{image_id}.jpg')  # adjust this as necessary

            # save the image file
            default_storage.save(image_path, ContentFile(img.read()))
            return HttpResponse(f"Image saved as {image_id}.jpg")
        else:
            return HttpResponseBadRequest("img file is required in the request")
