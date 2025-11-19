from django.urls import include, path
from rest_framework import routers

from aservo.views import BookViewSet,BookByIsbnView 

router = routers.DefaultRouter()
router.register(r"books", BookViewSet, basename="books")
urlpatterns = [
    path("", include(router.urls)),
    path("proxy/book/<str:isbn>/", BookByIsbnView.as_view(), name="book-by-isbn"),
]
