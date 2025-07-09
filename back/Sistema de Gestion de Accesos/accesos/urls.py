from django.urls import path, include
from rest_framework import routers

from .Api import UserViewSet,AuthViewSet

router = routers.DefaultRouter()
router.register("usuarios", UserViewSet, basename='usuarios')
router.register("auth", AuthViewSet, basename='auth')
urlpatterns = [
    path('', include(router.urls)),
]