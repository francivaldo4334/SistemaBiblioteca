from django.db.models import Q
import django_filters

from acervo_de_livros.models import LivroRegistro


class LivroRegistroFilterSet(django_filters.FilterSet):
    pesquisa = django_filters.CharFilter(method="realiza_pesquisa")

    def realiza_pesquisa(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(titulo__icontains=value)
            | Q(isbn__icontains=value)
            | Q(autores__icontains=value)
            | Q(editora__icontains=value)
        )

    class Meta:
        model = LivroRegistro
        fields = ["pesquisa"]
