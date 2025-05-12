from rest_framework import serializers
from .models import Booking
from restaurants.models import Restaurant
from datetime import datetime

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'customer', 'restaurant', 'date', 'time', 'party_size', 'status', 'created_at', 'updated_at']
        read_only_fields = ['customer', 'status', 'created_at', 'updated_at']

    def validate(self, data):
        # Get the instance if this is an update
        instance = getattr(self, 'instance', None)
        
        # Validate date is not in the past
        if 'date' in data and data['date'] < datetime.now().date():
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
