from django.db import models


class Seccion(models.Model):
    nombre = models.CharField(max_length=100)
    geojson = models.TextField()  # guardará el JSON como texto plano
