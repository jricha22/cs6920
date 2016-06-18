from django.db import models

class ManaCost(models.Model):
    COLORLESS = 'Colorless'
    RED = 'Red'
    GREEN = 'Green'
    BLACK = 'Black'
    BLUE = 'Blue'
    WHITE = 'White'
    COLOR_CHOICES = (
        (COLORLESS, COLORLESS),
        (RED, RED),
        (GREEN, GREEN),
        (BLACK, BLACK),
        (BLUE, BLUE),
        (WHITE, WHITE),
    )
    COLOR_LABEL = {BLACK: 'B', WHITE: 'W', BLUE: 'U', RED: 'R', GREEN: 'G'}

    color = models.CharField(max_length=9, choices=COLOR_CHOICES, default=COLORLESS)
    count = models.IntegerField(default=0)

    class Meta:
        ordering = ['color', 'count']

    def __unicode__(self):
        return str(self.count) if self.color == self.COLORLESS else self.COLOR_LABEL[self.color] * self.count

class Card(models.Model):
    """
    Magic the Gathering Cards
    """
    NORMAL = 'normal'
    SPLIT = 'split'
    FLIP = 'flip'
    DOUBLE_FACED = 'double-faced'
    TOKEN = 'token'
    PLANE = 'plane'
    SCHEME = 'scheme'
    PHENOMENON = 'phenomenon'
    LEVELER = 'leveller'
    VANGUARD = 'vanguard'
    LAYOUT_CHOICES = (
        (NORMAL, NORMAL),
        (SPLIT, SPLIT),
        (FLIP, FLIP),
        (DOUBLE_FACED, DOUBLE_FACED),
        (TOKEN, TOKEN),
        (PLANE, PLANE),
        (SCHEME, SCHEME),
        (PHENOMENON, PHENOMENON),
        (LEVELER, LEVELER),
        (VANGUARD, VANGUARD),
    )

    uuid = models.CharField(max_length=255, unique=True)
    layout = models.CharField(max_length=32, choices=LAYOUT_CHOICES, default=NORMAL)
    name = models.CharField(max_length=255)
    mana_cost = models.ManyToManyField(ManaCost)
    cmc = models.IntegerField(verbose_name="Complete Mana Cost", blank=True, null=True, default=0)
    type = models.CharField(max_length=255, db_index=True)
    rarity = models.CharField(max_length=255, db_index=True)
    text = models.TextField()
    flavor = models.TextField()
    artist = models.CharField(max_length=255)
    number = models.CharField(max_length=32)
    power_text = models.CharField(max_length=32)
    toughness_text = models.CharField(max_length=32)
    power = models.IntegerField(blank=True, null=True)
    toughness = models.IntegerField(blank=True, null=True)

    @property
    def mana_string(self):
        result = ''
        for cost in self.mana_cost.all():
            result += str(cost)
        return ''.join(sorted(result))

    class Meta:
        ordering = ['name']

    def __unicode__(self):
        return self.name

