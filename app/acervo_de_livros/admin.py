from django.contrib import admin

from acervo_de_livros.models import LivroRegistro, TipoLivro


@admin.register(LivroRegistro)
class LivroRegistroAdmin(admin.ModelAdmin):
    fields = [
        "isbn",
        "titulo",
        "autores",
        "ano_publicacao",
        "editora",
        "tipo",
        "quantidade",
        "edicao",
        "quantidade_disponivel",
    ]
    readonly_fields = ["quantidade_disponivel"]
    autocomplete_fields = ["tipo"]
    search_fields = ["titulo", "isbn", "autores", "editora"]

    class Media:
        js = ("acervo_de_livros/js/busca_isbn.js",)


@admin.register(TipoLivro)
class TipoLivroAdmin(admin.ModelAdmin):
    search_fields = ["tipo"]
