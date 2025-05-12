import django_filters
from .models import Review

class ReviewFilter(django_filters.FilterSet):
    restaurant_name = django_filters.CharFilter(field_name='restaurant__name', lookup_expr='icontains')
    customer_name = django_filters.CharFilter(field_name='customer__username', lookup_expr='icontains')
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='lte')
    min_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    max_date = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    has_comment = django_filters.BooleanFilter(method='filter_has_comment')

    def filter_has_comment(self, queryset, name, value):
        if value:
            return queryset.exclude(comment='')
        return queryset

    class Meta:
        model = Review
        fields = ['restaurant', 'customer', 'rating', 'created_at'] 