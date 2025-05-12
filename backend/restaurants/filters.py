import django_filters
from .models import Restaurant

class RestaurantFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    city = django_filters.CharFilter(lookup_expr='icontains')
    state = django_filters.CharFilter(lookup_expr='icontains')
    cuisine = django_filters.CharFilter(lookup_expr='icontains')
    min_cost = django_filters.NumberFilter(field_name='cost_rating', lookup_expr='gte')
    max_cost = django_filters.NumberFilter(field_name='cost_rating', lookup_expr='lte')
    is_approved = django_filters.BooleanFilter()

    class Meta:
        model = Restaurant
        fields = ['name', 'city', 'state', 'cuisine', 'cost_rating', 'is_approved'] 