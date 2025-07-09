from django.db import models

from Sistema_de_Administracion_Electoral.administracionElectoral.models import Mesa


class MesaVotante(models.Model):
    mesa = models.ForeignKey(Mesa, on_delete=models.CASCADE, related_name="votantes")
    ci = models.CharField(max_length=20)
