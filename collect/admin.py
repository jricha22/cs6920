from django.contrib import admin
from collect.models import Card, ManaCost, Collection


class CardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'rarity', 'cmc', 'power', 'toughness')
    list_filter = ['rarity', 'cmc', 'type']
    search_fields = ['name', 'type']


class ManaCostAdmin(admin.ModelAdmin):
    list_display = ('id', 'color', 'count')
    list_filter = ['color']
    search_fields = ['color']


class CollectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'card', 'count')
    list_filter = ['user']
    search_fields = ['user']

admin.site.register(Card, CardAdmin)
admin.site.register(ManaCost, ManaCostAdmin)
admin.site.register(Collection, CollectionAdmin)

