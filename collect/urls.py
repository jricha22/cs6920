from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from collect.views import *

router = DefaultRouter()
router.register(r'card', CardsViewSet, base_name="card")
router.register(r'manacost', ManaCostViewSet, base_name="manacost")

urlpatterns = [
    url(r'^$', collect_root, name='collect-root'),
    url(r'^', include(router.urls)),
]