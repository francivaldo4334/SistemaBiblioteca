from django.db import models

from emprestimo.choices import LoanState


class BookManager(models.Manager):
    def with_available_count(self):
        """
        Retorna um queryset de livros com o campo adicional `available_count` e `no_returned_count`
        calculado com base no total e nos empréstimos não devolvidos.
        """
        return self.get_queryset().annotate(
            not_returned_count=models.Count(
                "loans",
                filter=~models.Q(loans__status=LoanState.RETURNED.value),
            ),
            available_count=models.F("quantity") - models.F("not_returned_count"),
        )

    def available(self):
        """Filtra apenas livros com quantidade disponível > 0."""
        return self.with_available_count().filter(available_count__gt=0)
