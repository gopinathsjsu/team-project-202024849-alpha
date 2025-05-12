from rest_framework import serializers
from .models import Review
from users.models import User
from restaurants.models import Restaurant

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    restaurant_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'customer', 'customer_name', 'restaurant', 'restaurant_name', 
                 'rating', 'comment', 'created_at']
        read_only_fields = ['customer', 'created_at']

    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"

    def get_restaurant_name(self, obj):
        return obj.restaurant.name

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def validate(self, data):
        # Check if user has already reviewed this restaurant
        if self.context['request'].method == 'POST':
            user = self.context['request'].user
            restaurant = data['restaurant']
            if Review.objects.filter(customer=user, restaurant=restaurant).exists():
                raise serializers.ValidationError(
                    "You have already reviewed this restaurant"
                )
        return data

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data) 