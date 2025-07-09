from rest_framework import serializers, viewsets
import requests
from django.conf import settings  # para usar una URL definida en settings.py

from Sistema_de_Administracion_Electoral.administracionElectoral.api.recintoViewSet import RecintoSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.models import Mesa, Recinto
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class MesaSerializer(serializers.ModelSerializer):
    recinto = serializers.PrimaryKeyRelatedField(queryset=Recinto.objects.all())
    recinto_detalle = RecintoSerializer(source='recinto', read_only=True)

    class Meta:
        model = Mesa
        fields = '__all__'




class MesaViewSet(viewsets.ModelViewSet):
    queryset = Mesa.objects.all()
    serializer_class = MesaSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]

