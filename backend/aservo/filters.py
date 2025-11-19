from datetime import timedelta
from django.utils import timezone
import django_filters

from aservo.models import Book
from core.filters import SearchFilter


class BookFilterSet(django_filters.FilterSet):
    period = django_filters.ChoiceFilter(
        method="filter_period",
        choices=[
            ("D", "Dia"),
            ("W", "Semana"),
            ("M", "Mês"),
            ("Y", "Ano"),
        ],
        label="Período",
    )

    modified = django_filters.DateTimeFromToRangeFilter()

    search = SearchFilter(
        search_fields=[
            "title",
            "isbn",
            "authors",
            "book_type",
            "publisher",
        ]
    )

    def filter_period(self, queryset, name, value):
        now = timezone.now()
        value = (value or "W").upper()

        if value == "D":
            delta = timedelta(days=1)
        elif value == "M":
            delta = timedelta(days=30)
        elif value == "Y":
            delta = timedelta(days=365)
        else:
            delta = timedelta(days=7)

        start_current = now - delta
        start_previous = start_current - delta

        # Guarda os períodos no próprio filtro (para uso posterior na view)
        self.period_value = value
        self.start_current = start_current
        self.start_previous = start_previous

        # retorna apenas os registros do período atual
        return queryset.filter(modified__gte=start_current)

    class Meta:
        model = Book
        fields = ["period", "modified", "search"]
