import django_filters

from core.filters import SearchFilter
from emprestimo.models import Loan, Student


class StudentFilterSet(django_filters.FilterSet):
    search = SearchFilter(
        search_fields=[
            "name",
            "registration",
        ],
    )

    class Meta:
        model = Student
        fields = ["search"]


class LoanFilterSet(django_filters.FilterSet):
    search = SearchFilter(
        search_fields=[
            "book__title",
            "student__name",
        ]
    )

    class Meta:
        model = Loan
        fields = ["search"]
