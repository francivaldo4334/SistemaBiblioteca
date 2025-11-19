from django.contrib import admin

from emprestimo.models import Loan, Student


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    pass


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    pass
