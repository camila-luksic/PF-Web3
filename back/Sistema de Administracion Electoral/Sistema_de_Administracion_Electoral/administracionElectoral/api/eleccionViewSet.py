from rest_framework import serializers, viewsets

from Sistema_de_Administracion_Electoral.administracionElectoral.api.seccionViewSet import SeccionSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.models import Seccion
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class EleccionSerializer(serializers.ModelSerializer):
    secciones = serializers.PrimaryKeyRelatedField(many=True, queryset=Seccion.objects.all())
    secciones_detalle = SeccionSerializer(source='secciones', many=True, read_only=True)

    class Meta:
        model = Eleccion
        fields = '__all__'


class EleccionViewSet(viewsets.ModelViewSet):
    queryset = Eleccion.objects.all()
    serializer_class = EleccionSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]