# backend/bookings/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Booking
from .serializers import BookingSerializer
from .filters import BookingFilter
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
try:
    from twilio.rest import Client as TwilioClient
except ImportError:
    TwilioClient = None

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = BookingFilter
    search_fields = ['restaurant__name', 'customer__username']
    ordering_fields = ['date', 'time', 'party_size', 'status', 'created_at']
    ordering = ['-date', '-time']

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
        booking = serializer.save(customer=self.request.user)
        # Send confirmation email if email is provided
        if booking.email:
            send_mail(
                subject='Your Table Booking Confirmation',
                message=f'Thank you for booking at {booking.restaurant.name} on {booking.date} at {booking.time}.',
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@example.com'),
                recipient_list=[booking.email],
                fail_silently=True,
            )
        # Send SMS if phone_number is provided and Twilio is available
        if booking.phone_number and TwilioClient:
            try:
                twilio_client = TwilioClient(getattr(settings, 'TWILIO_ACCOUNT_SID', ''), getattr(settings, 'TWILIO_AUTH_TOKEN', ''))
                twilio_client.messages.create(
                    body=f'Your booking at {booking.restaurant.name} on {booking.date} at {booking.time} is confirmed.',
                    from_=getattr(settings, 'TWILIO_PHONE_NUMBER', ''),
                    to=booking.phone_number
                )
            except Exception as e:
                print('Twilio SMS send failed:', e)

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.customer and self.request.user.role not in ['admin', 'manager']:
            raise PermissionDenied("You do not have permission to modify this booking.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.customer and self.request.user.role not in ['admin', 'manager']:
            raise PermissionDenied("You do not have permission to delete this booking.")
        instance.delete()

    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        restaurant_id = request.query_params.get('restaurant')
        date = request.query_params.get('date')
        time = request.query_params.get('time')
        party_size = request.query_params.get('party_size')

        if not all([restaurant_id, date, time, party_size]):
            return Response(
                {'error': 'Missing required parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            party_size = int(party_size)
            if party_size < 1 or party_size > 20:
                return Response(
                    {'error': 'Party size must be between 1 and 20'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {'error': 'Invalid party size'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            restaurant = self.queryset.model.restaurant.field.related_model.objects.get(id=restaurant_id)
        except self.queryset.model.restaurant.field.related_model.DoesNotExist:
            return Response(
                {'error': 'Restaurant not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        is_available = self.queryset.model.check_availability(
            restaurant=restaurant,
            date=date,
            time=time,
            party_size=party_size
        )

        return Response({'available': is_available})

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        if request.user.role not in ['admin', 'manager']:
            return Response(
                {"detail": "Only admins and managers can confirm bookings."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'confirmed'
        booking.save()
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if request.user.role not in ['admin', 'manager'] and request.user != booking.customer:
            return Response(
                {"detail": "Only the customer, admins, and managers can cancel bookings."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'cancelled'
        booking.save()
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        booking = self.get_object()
        if request.user.role not in ['admin', 'manager']:
            return Response(
                {"detail": "Only admins and managers can mark bookings as completed."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'completed'
        booking.save()
        return Response(self.get_serializer(booking).data)
