from rest_framework import serializers, viewsets

from Sistema_de_Administracion_Electoral.administracionElectoral.api import EleccionSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.api.seccionViewSet import SeccionSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.models import Seccion, Papeleta
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class PapeletaSerializer(serializers.ModelSerializer):
    eleccion_detalle = EleccionSerializer(source='eleccion', read_only=True)
    seccion_detalle = SeccionSerializer(source='seccion', read_only=True)

    class Meta:
        model = Papeleta
        fields = '__all__'


class PapeletaViewSet(viewsets.ModelViewSet):
    queryset = Papeleta.objects.all()
    serializer_class = PapeletaSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]