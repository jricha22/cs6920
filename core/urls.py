from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from core.views import *

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    url(r'^$', core_root, name='core-root'),
    url(r'^', include(router.urls)),
    url(r'^mtg-settings/$', MTGSettings.as_view(), name="mtg-settings"),
    url(r'^profile/$', ProfileView.as_view(), name="profile"),
    url(r'^login/$', LoginView.as_view(), name="login"),
    url(r'^create-account/$', CreateAccountView.as_view(), name="create-account"),
    url(r'^change-password/$', ChangePasswordView.as_view(), name="change-password"),
]