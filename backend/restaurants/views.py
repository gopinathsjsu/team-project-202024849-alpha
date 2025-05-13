# backend/restaurants/views.py
from django.http import JsonResponse
from rest_framework import generics, viewsets
from .models import Restaurant
from .serializers import RestaurantSerializer
from .filters import RestaurantFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from datetime import datetime, timedelta

def ping(request):
    return JsonResponse({'message': 'pong from restaurants'})

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = RestaurantFilter
    search_fields = ['name', 'city', 'state', 'cuisine', 'description']
    ordering_fields = ['name', 'city', 'cost_rating', 'is_approved']
    ordering = ['name']

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

class RestaurantApproveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        if request.user.role != 'admin':
            raise PermissionDenied("Only admins can approve restaurants.")
        try:
            restaurant = Restaurant.objects.get(pk=pk)
        except Restaurant.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        approve = request.data.get('is_approved')
        if approve is None:
            return Response({'detail': 'is_approved field is required.'}, status=status.HTTP_400_BAD_REQUEST)
        restaurant.is_approved = bool(approve)
        restaurant.save()
        return Response(RestaurantSerializer(restaurant).data)

class RestaurantSearchView(generics.ListAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Restaurant.objects.filter(is_approved=True)
        city = self.request.query_params.get('city')
        state = self.request.query_params.get('state')
        zip_code = self.request.query_params.get('zip_code')

        print(f"Search params: city={city}, state={state}, zip_code={zip_code}")
        print(f"Initial queryset count: {queryset.count()}")

        if city:
            queryset = queryset.filter(city__icontains=city)
            print(f"After city filter: {queryset.count()}")
        if state:
            queryset = queryset.filter(state__icontains=state)
            print(f"After state filter: {queryset.count()}")
        if zip_code:
            queryset = queryset.filter(zip_code__icontains=zip_code)
            print(f"After zip_code filter: {queryset.count()}")

        return queryset