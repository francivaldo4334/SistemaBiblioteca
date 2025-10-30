from django.http import JsonResponse
from acervo_de_livros.models import valida_codigo_isbn
import isbnlib


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
