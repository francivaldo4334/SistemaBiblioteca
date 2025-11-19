from django.db.models import Q
import django_filters


class SearchFilter(django_filters.CharFilter):
    """
    Filtro genérico de busca textual.
    Permite buscar em múltiplos campos informados em `search_fields`.

    Exemplo de uso:
        search = SearchFilter(search_fields=["title", "author__name"])
    """

    def __init__(self, *args, **kwargs):
        self.search_fields = kwargs.pop("search_fields", [])
        super().__init__(*args, **kwargs)

    def filter(self, queryset, value):  # type:ignore
        if not value:
            return queryset

        # constrói expressão OR dinâmica
        query = Q()
        for field in self.search_fields:
            query |= Q(**{f"{field}__icontains": value})  # type:ignore

        return queryset.filter(query)


