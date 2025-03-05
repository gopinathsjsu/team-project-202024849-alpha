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
import logging

logger = logging.getLogger(__name__)

try:
    from twilio.rest import Client as TwilioClient
    from twilio.base.exceptions import TwilioRestException
except ImportError:
    TwilioClient = None
    logger.warning("Twilio package not installed. SMS notifications will be disabled.")


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = BookingFilter
    search_fields = ["restaurant__name", "customer__username"]
    ordering_fields = ["date", "time", "party_size", "status", "created_at"]
    ordering = ["-date", "-time"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == "admin":
            return queryset
        elif self.request.user.role == "manager":
            return queryset.filter(restaurant__owner=self.request.user)
        else:
            return queryset.filter(customer=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        booking = serializer.save(customer=self.request.user)
        logger.info("perform_create called for booking")
        print("perform_create called for booking")
        logger.info(f"Booking phone number: {booking.phone_number}")
        print(f"Booking phone number: {booking.phone_number}")
        logger.info(f"TwilioClient: {TwilioClient}")
        print(f"TwilioClient: {TwilioClient}")

        # Send confirmation email if email is provided
        if booking.email:
            try:
                send_mail(
                    subject="Your Table Booking Confirmation",
                    message=f"Thank you for booking at {booking.restaurant.name} on {booking.date} at {booking.time}.",
                    from_email=getattr(
                        settings, "DEFAULT_FROM_EMAIL", "noreply@example.com"
                    ),
                    recipient_list=[booking.email],
                    fail_silently=True,
                )
            except Exception as e:
                logger.error(f"Failed to send email notification: {str(e)}")
                print(f"Failed to send email notification: {str(e)}")

        # Send SMS if phone_number is provided and Twilio is available
        if booking.phone_number and TwilioClient:
            logger.info("Attempting to send SMS via Twilio...")
            print("Attempting to send SMS via Twilio...")
            try:
                # Ensure phone number is in E.164 format
                phone_number = booking.phone_number
                if not phone_number.startswith("+"):
                    phone_number = "+" + phone_number

                twilio_client = TwilioClient(
                    settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN
                )
                logger.info(f"Twilio client created. Sending SMS to {phone_number}")
                print(f"Twilio client created. Sending SMS to {phone_number}")
                message = twilio_client.messages.create(
                    body=f"Your booking at {booking.restaurant.name} on {booking.date} at {booking.time} is confirmed.",
                    from_=settings.TWILIO_PHONE_NUMBER,
                    to=phone_number,
                )
                logger.info(f"SMS sent successfully. SID: {message.sid}")
                print(f"SMS sent successfully. SID: {message.sid}")
            except TwilioRestException as e:
                logger.error(f"Twilio error: {str(e)}")
                print(f"Twilio error: {str(e)}")
            except Exception as e:
                logger.error(f"Failed to send SMS notification: {str(e)}")
                print(f"Failed to send SMS notification: {str(e)}")

    def perform_update(self, serializer):
        if (
            self.request.user != serializer.instance.customer
            and self.request.user.role not in ["admin", "manager"]
        ):
            raise PermissionDenied("You do not have permission to modify this booking.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.customer and self.request.user.role not in [
            "admin",
            "manager",
        ]:
            raise PermissionDenied("You do not have permission to delete this booking.")
        instance.delete()
