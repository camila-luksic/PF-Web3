from rest_framework import serializers, viewsets

from Sistema_de_Administracion_Electoral.administracionElectoral.api.seccionViewSet import SeccionSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.models import Cargo, Seccion
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class CargoSerializer(serializers.ModelSerializer):
    secciones = serializers.PrimaryKeyRelatedField(many=True, queryset=Seccion.objects.all())
    secciones_detalle = SeccionSerializer(source='secciones', many=True, read_only=True)

    class Meta:
        model = Cargo
        fields = '__all__'


class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]