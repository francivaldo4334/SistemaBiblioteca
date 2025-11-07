from django.db.models.query import Q
import django_filters

from controle_de_emprestimo.models import AlunoRegistro


class AlunoRegistroFilterSet(django_filters.FilterSet):
    pesquisa = django_filters.CharFilter(method="realiza_pesquisa")

    def realiza_pesquisa(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(Q(nome__icontains=value) | Q(matricula__icontains=value))

    class Meta:
        model = AlunoRegistro
        fields = ["pesquisa"]
