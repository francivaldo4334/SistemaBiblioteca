from django.http import JsonResponse
from acervo_de_livros.filters import LivroRegistroFilterSet, TipoLivroFilterSet
from acervo_de_livros.models import LivroRegistro, TipoLivro, valida_codigo_isbn
import isbnlib
from rest_framework import viewsets

from acervo_de_livros.serializers import LivroRegistroSerializer, TipoLivroSerializer


def buscar_informacoes_do_livro_com_base_no_isbn(request):
    isbn = request.GET.get("isbn", "")
    if not isbn or not valida_codigo_isbn(isbn):
        return JsonResponse({"error": "ISBN inválido"}, status=400)
    try:
        meta = isbnlib.meta(isbn)
        autores = meta.get("Authors", [])
        return JsonResponse({
            "titulo": meta.get("Title", ""),
            "autores": ", ".join(autores),
            "editora": meta.get("Publisher", ""),
            "ano": meta.get("Year", ""),
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


class LivroRegistroViewSet(viewsets.ModelViewSet):
    queryset = LivroRegistro.objects.all()
    serializer_class = LivroRegistroSerializer
    filterset_class = LivroRegistroFilterSet


class TipoLivroViewSet(viewsets.ModelViewSet):
    queryset = TipoLivro.objects.all()
    serializer_class = TipoLivroSerializer
    filterset_class = TipoLivroFilterSet
