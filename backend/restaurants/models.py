from django.db import models
from users.models import User

class Restaurant(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'manager'})
    name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    cuisine = models.CharField(max_length=50)
    cost_rating = models.IntegerField()  # 1-5 scale
    description = models.TextField()
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return self.name
