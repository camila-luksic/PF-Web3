from django.db import models


class Papeleta(models.Model):
    eleccion = models.ForeignKey('Eleccion', on_delete=models.CASCADE)
    seccion = models.ForeignKey('Seccion', on_delete=models.CASCADE)
    archivo = models.FileField(upload_to='papeletas/')  # o generado dinámicamente
    fecha_generacion = models.DateTimeField(auto_now_add=True)
