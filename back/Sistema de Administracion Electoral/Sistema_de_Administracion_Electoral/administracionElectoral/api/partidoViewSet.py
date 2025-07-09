from rest_framework import serializers, viewsets

from Sistema_de_Administracion_Electoral.administracionElectoral.models import Partido
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class PartidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partido
        fields = '__all__'


class PartidoViewSet(viewsets.ModelViewSet):
    queryset = Partido.objects.all()
    serializer_class = PartidoSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]