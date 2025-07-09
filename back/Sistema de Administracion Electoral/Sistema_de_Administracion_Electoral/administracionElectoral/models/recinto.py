from django.db import models

from Sistema_de_Administracion_Electoral.administracionElectoral.models.seccion import Seccion


class Recinto(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)
    latitud = models.FloatField()
    longitud = models.FloatField()
    seccion = models.ForeignKey(Seccion, on_delete=models.CASCADE, related_name='recintos')
    cantidad_mesas = models.PositiveIntegerField(default=1)