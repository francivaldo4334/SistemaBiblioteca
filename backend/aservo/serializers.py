from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField

from aservo.models import Book


class BookSerializer(serializers.ModelSerializer):
    not_returned_count = serializers.SerializerMethodField()
    available_count = serializers.SerializerMethodField()

    image = Base64ImageField()

    class Meta:
        model = Book
        exclude = []

    def get_not_returned_count(self,obj):
        return Book.objects.with_available_count().filter(pk=obj.pk).first().not_returned_count
    def get_available_count(self,obj):
        return Book.objects.with_available_count().filter(pk=obj.pk).first().available_count


class BookMetricsSerializer(serializers.Serializer):
    key = serializers.CharField()
    value = serializers.IntegerField()
    period = serializers.ChoiceField(
        choices=[
            ("W", "Semana"),
            ("Y", "Ano"),
            ("M", "Mês"),
            ("D", "Dia"),
        ],
        required=False,
    )
