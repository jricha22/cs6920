import os
from .views import api_root
from django.conf.urls import include, url
from django.conf import settings

urlpatterns = [
    url(r'^$', api_root),
]

# Automatically include urls.py for all INSTALLED_APPS
api_modules = settings.API_MODULES
for module in api_modules:
    if module in settings.INSTALLED_APPS and module != 'rest_root':
        urlpatterns.append(url(r'^' + module.replace('_','-') + '/', include(module + '.urls')))