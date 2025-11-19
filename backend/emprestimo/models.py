from django.db import models
from django_extensions.db.models import TimeStampedModel, ActivatorModel

from emprestimo import choices


class Student(ActivatorModel):
    name = models.CharField()
    registration = models.CharField(unique=True)


class Loan(TimeStampedModel):
    book = models.ForeignKey(
        "aservo.Book",
        on_delete=models.CASCADE,
        related_name="loans",
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    return_date = models.DateField()
    postponed_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        choices=choices.LoanState.choices,
        default=choices.LoanState.OBTENDED,
        max_length=3,
    )


class OrderedLoan(Loan):
    class Meta:
        proxy = True
        ordering = ["-modified"]

