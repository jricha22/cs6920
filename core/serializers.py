'''Defines all the custom REST serializers used by this application.'''

from rest_framework import serializers
from django.contrib.auth.models import User, Group


class UserSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = User
        exclude = ('password', )


class GroupSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:

        model = Group
        fields = ('name',)