from rest_framework import serializers
from .models import Booking
from restaurants.models import Restaurant
from datetime import datetime, date
from django.utils import timezone
import logging

class BookingSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Booking
        fields = ['id', 'customer', 'restaurant', 'date', 'time', 'party_size', 'status', 'created_at', 'updated_at', 'email', 'phone_number']
        read_only_fields = ['customer', 'status', 'created_at', 'updated_at']

    def validate(self, data):
        logger = logging.getLogger(__name__)
        logger.info(f"BookingSerializer.validate called with data: {data}")
        print(f"BookingSerializer.validate called with data: {data}")
        # Get the instance if this is an update
        instance = getattr(self, 'instance', None)
        
        # Validate date is not in the past
        if 'date' in data:
            # Convert string date to date object if needed
            if isinstance(data['date'], str):
                data['date'] = datetime.strptime(data['date'], '%Y-%m-%d').date()
            
            # Compare with today's date in local timezone
            today = timezone.localtime().date()
            if data['date'] < today:
                raise serializers.ValidationError("Cannot book for a past date")

        # Validate party size
        if 'party_size' in data:
            if data['party_size'] < 1:
                raise serializers.ValidationError("Party size must be at least 1")
            if data['party_size'] > 20:
                raise serializers.ValidationError("Party size cannot exceed 20")

        # Check restaurant availability only if relevant fields are being updated
        if any(field in data for field in ['restaurant', 'date', 'time', 'party_size']):
            restaurant = data.get('restaurant', instance.restaurant if instance else None)
            date = data.get('date', instance.date if instance else None)
            time = data.get('time', instance.time if instance else None)
            party_size = data.get('party_size', instance.party_size if instance else None)
            
            if all([restaurant, date, time, party_size]):
                if not Booking.check_availability(restaurant, date, time, party_size):
                    raise serializers.ValidationError("Restaurant is not available for the selected time and party size")

        return data

    def create(self, validated_data):
        # Set the customer to the current user
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)
