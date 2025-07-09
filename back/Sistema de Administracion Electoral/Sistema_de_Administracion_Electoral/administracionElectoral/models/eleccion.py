from django.db import models

class Eleccion(models.Model):
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)  # Ej: "Municipal", "Nacional"
    fecha = models.DateField()
    secciones = models.ManyToManyField('Seccion', related_name='elecciones')
