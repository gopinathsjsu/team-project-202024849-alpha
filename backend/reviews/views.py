# backend/reviews/views.py
from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Review
from .serializers import ReviewSerializer
from .filters import ReviewFilter

def ping(request):
    return JsonResponse({'message': 'pong from reviews'})

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = ReviewFilter
    search_fields = ['restaurant__name', 'customer__username', 'comment']
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == 'admin':
            return queryset
        elif self.request.user.role == 'manager':
            return queryset.filter(restaurant__owner=self.request.user)
        else:
            return queryset.filter(customer=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.customer and self.request.user.role != 'admin':
            raise PermissionDenied("You do not have permission to modify this review.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.customer and self.request.user.role != 'admin':
            raise PermissionDenied("You do not have permission to delete this review.")
        instance.delete()

    @action(detail=False, methods=['get'])
    def restaurant_reviews(self, request):
        restaurant_id = request.query_params.get('restaurant_id')
        if not restaurant_id:
            return Response(
                {"detail": "restaurant_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = self.get_queryset().filter(restaurant_id=restaurant_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
