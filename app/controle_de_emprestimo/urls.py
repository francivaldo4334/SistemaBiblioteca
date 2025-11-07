from django.urls import include, path
from rest_framework import routers

from controle_de_emprestimo.views import AlunoRegistroViewSet, EmprestimoViewSet

router = routers.DefaultRouter()

router.register(
    r"alunos_registrados", AlunoRegistroViewSet, basename="alunos_registrados"
)
router.register(r"emprestimos", EmprestimoViewSet, basename="emprestimos")


urlpatterns = [path("", include(router.urls))]
