'''Defines all the view functions that handle HTTP requests/responses.'''

from django.conf import settings
from django.contrib.auth import login, logout, authenticate
from django.db import IntegrityError
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
        'create-account': reverse('create-account', request=request, format=format),
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
    MTG user profile
    """

    @staticmethod
    def get(request, format=None):
        return Response(UserSerializer(request.user, context={'request': request}).data)


class LoginView(APIView):
    """
    MTG login.  POST inputs: 'username', 'password'
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

class CreateAccountView(APIView):
    """
    MTG create user account.  POST inputs: 'username', 'password', 'first_name', 'last_name', 'email'
    """
    permission_classes = (AllowAny, )

    @staticmethod
    def post(request, *args, **kwargs):
        required = ['username', 'password', 'first_name', 'last_name', 'email']
        if not all(key in request.data for key in required):
            return Response("Account creation must include username, password, first_name, last_name, and email",
                            status=status.HTTP_400_BAD_REQUEST)
        if not (request.data['username'] and request.data['password'] and
           request.data['first_name'] and request.data['last_name']):
            return Response("Account creation username, password, first_name, and last_name are required fields",
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            User.objects.create_user(username=request.data['username'], password=request.data['password'],
                                     first_name=request.data['first_name'], last_name=request.data['last_name'],
                                     email=request.data['email'])
        except IntegrityError:
            return Response("Username already exists", status=status.HTTP_403_FORBIDDEN)
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            if user.is_active:
                login(request, user)
                return Response(UserSerializer(user, context={'request': request}).data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class ChangePasswordView(APIView):
    """
    MTG reset user password.  POST inputs: 'old_password', 'password'
    Revalidate the user and try to change their password
    """
    @staticmethod
    def post(request, *args, **kwargs):
        required = ['old_password', 'password']
        if not all(key in request.data for key in required):
            return Response("Reset of password must include new password",
                            status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=request.user.username, password=request.data['old_password'])
        if user is not None:
            if user.is_active:
                login(request, user)
                user.set_password(request.data['password'])
                user.save()
                user = authenticate(username=request.user.username, password=request.data['password'])
                if user is not None:
                    if user.is_active:
                        login(request, user)
                        return Response(UserSerializer(user, context={'request': request}).data)
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_401_UNAUTHORIZED)