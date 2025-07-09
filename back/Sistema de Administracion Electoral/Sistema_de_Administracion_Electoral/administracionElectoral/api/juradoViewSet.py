from rest_framework import serializers, viewsets

from Sistema_de_Administracion_Electoral.administracionElectoral.api.mesaViewSet import MesaSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.models import JuradoElectoral, Mesa
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class JuradoSerializer(serializers.ModelSerializer):
    mesa = serializers.PrimaryKeyRelatedField(queryset=Mesa.objects.all())
    mesa_detalle = MesaSerializer(source='mesa', read_only=True)

    class Meta:
        model = JuradoElectoral
        fields = '__all__'


class JuradoViewSet(viewsets.ModelViewSet):
    queryset = JuradoElectoral.objects.all()
    serializer_class = JuradoSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]