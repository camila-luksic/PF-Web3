from rest_framework import serializers, viewsets
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from Sistema_de_Administracion_Electoral.administracionElectoral.api.seccionViewSet import SeccionSerializer
from Sistema_de_Administracion_Electoral.administracionElectoral.models import Recinto, Seccion, Mesa, MesaVotante, \
    JuradoElectoral
from Sistema_de_Administracion_Electoral.administracionElectoral.models.eleccion import Eleccion
from Sistema_de_Administracion_Electoral.administracionElectoral.permisos import EsAdministradorElectoral, \
    CustomJWTAuthentication


class RecintoSerializer(serializers.ModelSerializer):
    seccion = serializers.PrimaryKeyRelatedField(queryset=Seccion.objects.all())
    seccion_detalle = SeccionSerializer(source='seccion', read_only=True)

    class Meta:
        model = Recinto
        fields = '__all__'


class RecintoViewSet(viewsets.ModelViewSet):
    queryset = Recinto.objects.all()
    serializer_class = RecintoSerializer
    authentication_classes = [CustomJWTAuthentication]  # ✅ CORRECTO
    permission_classes = [EsAdministradorElectoral]

    def perform_create(self, serializer):
        recinto = serializer.save()

        for i in range(1, recinto.cantidad_mesas + 1):
            Mesa.objects.create(
                numero=i,
                recinto=recinto,
                cantidad_votantes=0
            )

@api_view(["POST"])
def asignar_votantes_y_jurados(request, id_recinto):
        votantes = request.data.get("votantes", [])
        if not votantes:
            return Response({"error": "Lista de votantes vacía"}, status=400)

        recinto = get_object_or_404(Recinto, pk=id_recinto)
        mesas = list(recinto.mesas.order_by("numero"))

        if not mesas:
            return Response({"error": "Este recinto no tiene mesas creadas."}, status=400)

        # Limpiar asignaciones anteriores si es necesario:
        MesaVotante.objects.filter(mesa__recinto=recinto).delete()
        JuradoElectoral.objects.filter(mesa__recinto=recinto).delete()

        asignaciones_votantes = []
        jurados_asignados = []

        # Repartir votantes en forma circular
        for i, votante in enumerate(votantes):
            mesa = mesas[i % len(mesas)]
            asignaciones_votantes.append(MesaVotante(mesa=mesa, ci=votante["ci"]))
            mesa.cantidad_votantes += 1
            mesa.save()

        MesaVotante.objects.bulk_create(asignaciones_votantes)

        # Asignar jurados: 3 titulares por mesa (primeros votantes de cada mesa)
        for i, mesa in enumerate(mesas):
            mesa_votantes = [mv for mv in asignaciones_votantes if mv.mesa == mesa]
            primeros_tres = mesa_votantes[:1]
            for mv in primeros_tres:
                jurados_asignados.append(JuradoElectoral(mesa=mesa, ci=mv.ci))

        JuradoElectoral.objects.bulk_create(jurados_asignados)

        return Response({
            "status": "ok",
            "votantes_asignados": len(asignaciones_votantes),
            "jurados_asignados": len(jurados_asignados),
        }, status=200)