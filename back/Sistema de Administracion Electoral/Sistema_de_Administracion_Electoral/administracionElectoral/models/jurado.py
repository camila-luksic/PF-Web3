from django.db import models


class JuradoElectoral(models.Model):
    nombre = models.CharField(max_length=100)
    ci = models.CharField(max_length=20, unique=True)
    mesa = models.ForeignKey('Mesa', on_delete=models.CASCADE, related_name='jurados')
