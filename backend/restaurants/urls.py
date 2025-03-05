from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, RestaurantApproveView, ping

router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('restaurants/<int:pk>/approve/', RestaurantApproveView.as_view(), name='restaurant-approve'),
    path('ping/', ping, name='restaurant-ping'),
]