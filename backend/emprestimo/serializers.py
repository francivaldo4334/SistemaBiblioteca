from typing import cast
from rest_framework import serializers

from aservo.models import Book
from emprestimo.choices import LoanState
from emprestimo.models import Loan, Student


class LoanSerializer(serializers.ModelSerializer):
    student_display = serializers.SerializerMethodField()
    book_display = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        exclude = []

    def get_student_display(self, obj: Loan):
        student = cast(Student, obj.student)
        return student.name

    def get_book_display(self, obj: Loan):
        book = cast(Book, obj.book)
        return f"{book.title}/{book.isbn}"

    def get_status_display(self, obj: Loan):
        return LoanState(obj.status).label


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        exclude = []


class PostponedActionSerializer(serializers.Serializer):
    postponed_date = serializers.DateField()
