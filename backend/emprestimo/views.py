from rest_framework import viewsets
from rest_framework.decorators import action
from viewflow.fsm import TransitionNotAllowed

from core.paginations import CustomPagination
from emprestimo.filters import LoanFilterSet, StudentFilterSet
from emprestimo.frows import LoanFlow
from emprestimo.models import OrderedLoan, Student
from emprestimo.serializers import (
    LoanSerializer,
    PostponedActionSerializer,
    StudentSerializer,
)


class LoanViewSet(viewsets.ModelViewSet):
    queryset = OrderedLoan.objects.all()  # type:ignore
    serializer_class = LoanSerializer
    pagination_class = CustomPagination
    filterset_class = LoanFilterSet

    def get_serializer_class(self):  # type: ignore
        if self.action == "postponed":
            return PostponedActionSerializer
        return super().get_serializer_class()

    @action(["POST"], True)
    def return_book(self, request, **kwargs):
        try:
            obj = self.get_object()
            LoanFlow(obj).return_book()
            obj.save()
            return super().retrieve(request)
        except TransitionNotAllowed as e:
            return super().retrieve(request)

    @action(["POST"], True)
    def postponed(self, request, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        LoanFlow(obj).postponed(serializer.data["postponed_date"])
        obj.save()
        return super().retrieve(request)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()  # type:ignore
    serializer_class = StudentSerializer
    pagination_class = CustomPagination
    filterset_class = StudentFilterSet
