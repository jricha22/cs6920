'''Defines all the view functions that handle HTTP requests/responses.'''

from django.conf import settings
from django.contrib.auth import login, logout, authenticate
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status
from core.serializers import *


@api_view(('GET',))
def core_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'groups': reverse('group-list', request=request, format=format),
        'profile': reverse('profile', request=request, format=format),
        'mtg-settings': reverse('mtg-settings', request=request, format=format),
        'login': reverse('login', request=request, format=format),
    })


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class GroupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class MTGSettings(APIView):
    """
    MTG settings configuration
    """

    @staticmethod
    def get(request, format=None):
        return Response(settings.MTG)


class ProfileView(APIView):
    """
    GRS user profile
    """

    @staticmethod
    def get(request, format=None):
        return Response(UserSerializer(request.user, context={'request': request}).data)


class LoginView(APIView):
    """
    GRS login
    """
    permission_classes = (AllowAny, )

    @staticmethod
    def post(request, *args, **kwargs):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            if user.is_active:
                login(request, user)
                return Response(UserSerializer(user, context={'request': request}).data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def delete(request, *args, **kwargs):
        logout(request)
        return Response({})