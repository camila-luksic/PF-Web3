from django.db import models


class Cargo(models.Model):
    nombre = models.CharField(max_length=100)
    secciones = models.ManyToManyField('Seccion', related_name='cargos')
