from django.urls import path, include
from rest_framework import routers




from Sistema_de_Administracion_Electoral.administracionElectoral.api import EleccionViewSet, SeccionViewSet, \
    RecintoViewSet, MesaViewSet, JuradoViewSet, CargoViewSet, CandidatoViewSet, PartidoViewSet

from Sistema_de_Administracion_Electoral.administracionElectoral.api.recintoViewSet import asignar_votantes_y_jurados


router = routers.DefaultRouter()
router.register('eleciones', EleccionViewSet)
router.register('secciones', SeccionViewSet)
router.register('recintos', RecintoViewSet)
router.register('mesas', MesaViewSet)
router.register('jurados', JuradoViewSet)
router.register('partidos', PartidoViewSet)
router.register('cargos', CargoViewSet)
router.register('candidatos', CandidatoViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('asignar-votantes-jurados/<int:id_recinto>/', asignar_votantes_y_jurados, name='asignar_votantes_jurados'),
]
