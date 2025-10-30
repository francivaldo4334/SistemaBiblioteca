from django.urls import path
from . import views

urlpatterns = [
    path(
        "buscar_informacoes_do_livro_com_base_no_isbn/",
        views.buscar_informacoes_do_livro_com_base_no_isbn,
        name="buscar_informacoes_do_livro_com_base_no_isbn",
    ),
]
