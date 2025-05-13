from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test users for development'

    def handle(self, *args, **kwargs):
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='testpassword',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created admin user'))

        # Create test manager
        if not User.objects.filter(username='manager1').exists():
            User.objects.create_user(
                username='manager1',
                email='manager1@example.com',
                password='testpass123',
                role='manager'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created manager user'))

        # Create test customer
        if not User.objects.filter(username='customer1').exists():
            User.objects.create_user(
                username='customer1',
                email='customer1@example.com',
                password='testpass123',
                role='customer'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created customer user')) 