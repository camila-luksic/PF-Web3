from django.db import models

from Sistema_de_Administracion_Electoral.administracionElectoral.models.recinto import Recinto


class Mesa(models.Model):
    numero = models.IntegerField()
    recinto = models.ForeignKey(Recinto, on_delete=models.CASCADE, related_name='mesas')
    cantidad_votantes = models.IntegerField(default=0)  # actualizado al asignar votantes
