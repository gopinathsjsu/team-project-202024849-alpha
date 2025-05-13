# backend/users/views.py (Week 5)
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.serializers import ModelSerializer
from rest_framework.exceptions import PermissionDenied
from django.db.models import Count, Q
from datetime import datetime, timedelta

User = get_user_model()

class UserRegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'role', 'first_name', 'last_name', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Please provide both username and password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone_number': user.phone_number
                }
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone_number': user.phone_number
        })

    def patch(self, request):
        user = request.user
        serializer = UserRegisterSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            raise PermissionDenied("Only admins can access the user dashboard.")

        # Get date range
        days = int(request.query_params.get('days', 30))
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Get user statistics
        total_users = User.objects.count()
        users_by_role = User.objects.values('role').annotate(count=Count('id'))
        
        # Get recent registrations
        recent_registrations = User.objects.filter(
            date_joined__gte=start_date
        ).order_by('-date_joined')[:5]

        # Get active users (users who have logged in recently)
        active_users = User.objects.filter(
            last_login__gte=start_date
        ).count()

        return Response({
            'total_users': total_users,
            'users_by_role': users_by_role,
            'recent_registrations': [{
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'date_joined': user.date_joined
            } for user in recent_registrations],
            'active_users': active_users
        })

def ping(request):
    return JsonResponse({'message': 'pong from users'}) 