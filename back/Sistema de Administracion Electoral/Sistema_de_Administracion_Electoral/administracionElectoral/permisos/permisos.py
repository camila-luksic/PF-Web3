from rest_framework.permissions import BasePermission

class EsAdministradorElectoral(BasePermission):
    def has_permission(self, request, view):
        roles = getattr(request.user, "roles", [])
        return "AdministradorElecciones" in roles
