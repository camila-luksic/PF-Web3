from django.db import models

from Sistema_de_Administracion_Electoral.administracionElectoral.models import Partido
from Sistema_de_Administracion_Electoral.administracionElectoral.models.cargo import Cargo


class Candidato(models.Model):
    nombre = models.CharField(max_length=100)
    ci = models.CharField(max_length=20, unique=True)
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE)
    partido = models.ForeignKey(Partido, on_delete=models.CASCADE)
    foto = models.ImageField(upload_to='candidatos/', null=True, blank=True)