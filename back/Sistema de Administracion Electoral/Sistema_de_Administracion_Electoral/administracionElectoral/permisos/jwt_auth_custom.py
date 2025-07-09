from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth.models import AnonymousUser

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):

        user = AnonymousUser()
        user.id = validated_token.get("user_id")
        user.roles = validated_token.get("roles", [])
        return user
