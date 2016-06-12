from django.contrib import admin
from collect.models import Card, ManaCost


class CardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'rarity', 'cmc', 'power', 'toughness')
    list_filter = ['rarity', 'cmc', 'type']
    search_fields = ['name', 'type']


class ManaCostAdmin(admin.ModelAdmin):
    list_display = ('id', 'color', 'count')
    list_filter = ['color']
    search_fields = ['color']

admin.site.register(Card, CardAdmin)
admin.site.register(ManaCost, ManaCostAdmin)

