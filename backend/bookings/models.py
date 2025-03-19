from django.db import models
from users.models import User
from restaurants.models import Restaurant
from datetime import datetime
from django.core.exceptions import ValidationError


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    customer = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={"role": "customer"}
    )
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    date = models.DateField()

    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=32, blank=True, null=True)

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
