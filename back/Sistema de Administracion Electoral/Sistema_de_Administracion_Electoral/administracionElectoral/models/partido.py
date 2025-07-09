from django.db import models


class Partido(models.Model):
    nombre = models.CharField(max_length=100)
    sigla = models.CharField(max_length=10)
    color = models.CharField(max_length=7)  # Hex code, ej: #FF0000
