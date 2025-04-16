import django_filters
from .models import Booking
from django.utils import timezone


class BookingFilter(django_filters.FilterSet):
    restaurant_name = django_filters.CharFilter(
        field_name="restaurant__name", lookup_expr="icontains"
    )
    customer_name = django_filters.CharFilter(
        field_name="customer__username", lookup_expr="icontains"
    )
    min_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    max_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")
    min_party_size = django_filters.NumberFilter(
        field_name="party_size", lookup_expr="gte"
    )
    max_party_size = django_filters.NumberFilter(
        field_name="party_size", lookup_expr="lte"
    )
    status = django_filters.ChoiceFilter(choices=Booking.STATUS_CHOICES)
    upcoming = django_filters.BooleanFilter(method="filter_upcoming")

    def filter_upcoming(self, queryset, name, value):
        if value:
            return queryset.filter(date__gte=timezone.now().date())
        return queryset

    class Meta:
        model = Booking
        fields = ["restaurant", "customer", "date", "time", "party_size", "status"]
