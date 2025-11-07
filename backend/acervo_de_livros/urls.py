from django.urls import include, path
from . import views
from rest_framework import routers

router = routers.DefaultRouter()

router.register(
    r"livros_registrados", views.LivroRegistroViewSet, basename="livros_registrados"
)
router.register(r"tipos_de_livros", views.TipoLivroViewSet, basename="tipos_de_livros")

urlpatterns = [
    path(
        "buscar_informacoes_do_livro_com_base_no_isbn/",
        views.buscar_informacoes_do_livro_com_base_no_isbn,
        name="buscar_informacoes_do_livro_com_base_no_isbn",
    ),
    path("", include(router.urls)),
]
