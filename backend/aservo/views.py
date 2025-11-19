from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiExample,
    OpenApiResponse,
)
import requests

from aservo.filters import BookFilterSet
from core.paginations import CustomPagination
from aservo.serializers import BookMetricsSerializer, BookSerializer, Book
from emprestimo.choices import LoanState
from emprestimo.models import Loan


# Create your views here.
class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    queryset = Book.objects.all()  # type: ignore
    filterset_class = BookFilterSet
    pagination_class = CustomPagination

    def get_serializer_class(self):  # type: ignore
        if self.action == "metrics":
            return BookMetricsSerializer
        return super().get_serializer_class()

    @action(["GET"], False)
    def metrics(self, request, **kwargs):
        from django.db.models import Sum

        f_loans = self.filterset_class(
            request.GET,
            queryset=Loan.objects.all(),  # type: ignore
        )

        queryset_books = Book.objects.with_available_count()
        queryset_loans = f_loans.qs
        query_aggregate = queryset_books.aggregate(
            total=Sum("quantity"),
            total_not_returned_count=Sum("not_returned_count"),
            total_available_count=Sum("available_count"),
        )
        total_books = query_aggregate["total"] or 0
        total_available_count = query_aggregate["total_available_count"] or 0
        total_not_returned_count = query_aggregate["total_not_returned_count"] or 0
        total_not_returned = queryset_loans.exclude(
            status=LoanState.RETURNED.value
        ).count()
        total_returned = queryset_loans.filter(status=LoanState.RETURNED.value).count()

        serializer = self.get_serializer(
            [
                {
                    "key": "total_available_count",
                    "value": total_available_count,
                },
                {
                    "key": "total_not_returned_count",
                    "value": total_not_returned_count,
                },
                {
                    "key": "total_books",
                    "value": total_books,
                },
                {
                    "key": "total_not_returned",
                    "value": total_not_returned,
                    "period": getattr(f_loans, "period_value", None),
                },
                {
                    "key": "total_returned",
                    "value": total_returned,
                    "period": getattr(f_loans, "period_value", None),
                },
            ],
            many=True,
        )
        return Response(serializer.data)


class BookByIsbnView(APIView):
    """
    Proxy para buscar informações de um livro via Open Library,
    resolvendo o problema de CORS no frontend.
    """

    @extend_schema(
        summary="Buscar livro por ISBN (via Open Library)",
        description=(
            "Este endpoint consulta a Open Library API para retornar dados "
            "bibliográficos de um livro com base no ISBN informado. "
            "A requisição é feita do lado do servidor para evitar problemas de CORS."
        ),
        parameters=[
            OpenApiParameter(
                name="isbn",
                description="Código ISBN do livro",
                required=True,
                type=str,
                location=OpenApiParameter.PATH,
                examples=[
                    OpenApiExample("Exemplo ISBN válido", value="9780140328721"),
                ],
            )
        ],
        responses={
            200: OpenApiResponse(
                description="Informações do livro encontradas",
                examples=[
                    OpenApiExample(
                        "Resposta de sucesso",
                        value={
                            "title": "Matilda",
                            "authors": [{"name": "Roald Dahl"}],
                            "publish_date": "1988",
                            "cover": {
                                "small": "https://covers.openlibrary.org/b/id/8226191-S.jpg",
                                "medium": "https://covers.openlibrary.org/b/id/8226191-M.jpg",
                                "large": "https://covers.openlibrary.org/b/id/8226191-L.jpg",
                            },
                        },
                    )
                ],
            ),
            404: OpenApiResponse(
                description="Livro não encontrado",
                examples=[
                    OpenApiExample(
                        "Livro inexistente", value={"error": "Livro não encontrado"}
                    )
                ],
            ),
            500: OpenApiResponse(
                description="Erro interno ao consultar a Open Library",
                examples=[
                    OpenApiExample(
                        "Erro de conexão", value={"error": "HTTPSConnectionPool(...)"}
                    ),
                ],
            ),
        },
        tags=["Livros"],
    )
    def get(self, request, isbn: str):
        url = "https://openlibrary.org/api/books"
        params = {
            "bibkeys": f"ISBN:{isbn}",
            "format": "json",
            "jscmd": "data",
        }
        headers = {"User-Agent": "Biblioteca Escola"}

        try:
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            book_data = data.get(f"ISBN:{isbn}")

            if not book_data:
                return Response(
                    {"error": "Livro não encontrado"}, status=status.HTTP_404_NOT_FOUND
                )

            return Response(book_data, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
