from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

User = get_user_model()

def set_cookie(response, key, value, expires):
    response.set_cookie(
        key,
        value,
        httponly=True,
        secure=True,
        samesite='None',
        max_age=expires,
    )

class CookieTokenObtainPairView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({'error': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({'error': 'Usuario inactivo'}, status=status.HTTP_403_FORBIDDEN)

        tokens = RefreshToken.for_user(user)
        roles = list(user.groups.values_list('name', flat=True))
        tokens['roles'] = roles

        response = Response({
            'access': str(tokens.access_token),
            'refresh': str(tokens),
            'roles': roles,
            'email': user.email
        }, status=status.HTTP_200_OK)

        # Opcional: cookies para frontend web
        set_cookie(response, 'access', str(tokens.access_token), 30 * 60)
        set_cookie(response, 'refresh', str(tokens), 24 * 60 * 60)

        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if not refresh_token:
            return Response({'detail': 'Refresh token not found in cookies'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        access_token = serializer.validated_data['access']
        response = Response({
            'access': access_token
        }, status=status.HTTP_200_OK)

        set_cookie(response, 'access', str(access_token), 30 * 60)
        return response
