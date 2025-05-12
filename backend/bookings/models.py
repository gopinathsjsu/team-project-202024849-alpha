from django.db import models
from users.models import User
from restaurants.models import Restaurant
from datetime import datetime
from django.core.exceptions import ValidationError

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed')
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'customer'})
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    party_size = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Validate party size
        if self.party_size < 1:
            raise ValidationError("Party size must be at least 1")
        if self.party_size > 20:  # Assuming max party size is 20
            raise ValidationError("Party size cannot exceed 20")

        # Validate date is not in the past
        if self.date < datetime.now().date():
            raise ValidationError("Cannot book for a past date")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer.username} @ {self.restaurant.name} on {self.date} {self.time}"

    @classmethod
    def check_availability(cls, restaurant, date, time, party_size):
        """
        Check if a restaurant is available for the given date, time, and party size.
        Returns True if available, False otherwise.
        """
        # Get all bookings for the restaurant on the given date and time
        conflicting_bookings = cls.objects.filter(
            restaurant=restaurant,
            date=date,
            time=time,
            status__in=['pending', 'confirmed']
        )
        
        # Calculate total party size of existing bookings
        total_booked = sum(booking.party_size for booking in conflicting_bookings)
        
        # Assuming restaurant capacity is 100 (you might want to add this to Restaurant model)
        restaurant_capacity = 100
        
        # Check if there's enough capacity
        return (total_booked + party_size) <= restaurant_capacity
