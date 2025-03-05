# backend/restaurants/views.py (Week 2)
from django.http import JsonResponse
from rest_framework import viewsets
from .models import Restaurant
from .serializers import RestaurantSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

def ping(request):
    return JsonResponse({'message': 'pong from restaurants'})

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'admin':
            return queryset
        elif self.request.user.role == 'manager':
            return queryset.filter(owner=self.request.user)
        else:
            return queryset.filter(is_approved=True)

    def perform_create(self, serializer):
        if self.request.user.role != 'manager':
            raise PermissionDenied("Only restaurant managers can add restaurants.")
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.owner and self.request.user.role != 'admin':
            raise PermissionDenied("You do not have permission to modify this restaurant.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.owner and self.request.user.role != 'admin':
            raise PermissionDenied("You do not have permission to delete this restaurant.")
        instance.delete() 