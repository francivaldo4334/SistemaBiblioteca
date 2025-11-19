from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "total_pages": self.page.paginator.num_pages,
            "current_page": self.page.number,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        })

    def get_paginated_response_schema(self, schema):
        result = super().get_paginated_response_schema(schema)
        return {
            **result,
            "properties": {
                **result["properties"],
                "total_pages": {
                    "type": "integer",
                    "example": 123,
                },
                "current_page": {
                    "type": "integer",
                    "example": 123,
                },
            },
        }
