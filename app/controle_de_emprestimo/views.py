from typing import cast
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.routers import Response
from rest_framework.permissions import IsAuthenticated

from controle_de_emprestimo.filters import AlunoRegistroFilterSet
from controle_de_emprestimo.models import AlunoRegistro, Emprestimo
from controle_de_emprestimo.serializers import (
    AlunoRegistroSerializer,
    EmprestimoSerializer,
)


class AlunoRegistroViewSet(viewsets.ModelViewSet):
    queryset = AlunoRegistro.objects.all()
    serializer_class = AlunoRegistroSerializer
    filterset_class = AlunoRegistroFilterSet


class EmprestimoViewSet(viewsets.ModelViewSet):
    queryset = Emprestimo.objects.all()
    serializer_class = EmprestimoSerializer
    permission_classes = [IsAuthenticated]

    @action(["GET"], True)
    def devolver_livro(self, request, **kwargs):
        emprestimo = cast(Emprestimo, self.get_object())
        ja_devolvido = not emprestimo.devolver_livro()
        if ja_devolvido:
            return Response("já foi devolvido", status=400)
        return Response("foi devolvido", status=200)
