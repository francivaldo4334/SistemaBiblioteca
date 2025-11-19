from django.urls import include, path
from rest_framework import routers

from emprestimo.views import LoanViewSet, StudentViewSet

router = routers.DefaultRouter()
router.register(
    r"loans",
    LoanViewSet,
    basename="loans",
)
router.register(
    r"students",
    StudentViewSet,
    basename="students",
)
urlpatterns = [
    path("", include(router.urls)),
]
