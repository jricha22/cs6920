import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse, NoReverseMatch
from django.conf import settings

@api_view(('GET',))
def api_root(request, format=None):
    api_modules = settings.API_MODULES
    response_dict = {}
    for module in api_modules:
        if module in settings.INSTALLED_APPS and module != 'rest_root':
            try:
                response_dict[module] = reverse(module + '-root', request=request, format=format)
            except NoReverseMatch:
                response_dict[module] = "no registered views!"
    return Response(response_dict)