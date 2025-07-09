from rest_framework import serializers, viewsets

from Sistema_de_Administracion_Electoral.administracionElectoral.api.cargoViewSet import CargoSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.api.partidoViewSet import PartidoSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.models import Candidato, Cargo, Partido
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class CandidatoSerializer(serializers.ModelSerializer):
    cargo = serializers.PrimaryKeyRelatedField(queryset=Cargo.objects.all())
    partido = serializers.PrimaryKeyRelatedField(queryset=Partido.objects.all())
    cargo_detalle = CargoSerializer(source='cargo', read_only=True)
    partido_detalle = PartidoSerializer(source='partido', read_only=True)

    class Meta:
        model = Candidato
        fields = '__all__'


class CandidatoViewSet(viewsets.ModelViewSet):
    queryset = Candidato.objects.all()
    serializer_class = CandidatoSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]