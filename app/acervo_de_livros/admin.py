from django.contrib import admin

from acervo_de_livros.models import LivroRegistro


@admin.register(LivroRegistro)
class LivroRegistroAdmin(admin.ModelAdmin):
    fields = [
        "isbn",
        "titulo",
        "autores",
        "ano_publicacao",
        "quantidade",
        "tipo",
        "edicao",
        "editora",
    ]

    class Media:
        js = ("acervo_de_livros/js/busca_isbn.js",)
