from rest_framework import serializers


class LivroRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [
            "isbn",
            "titulo",
            "autores",
            "ano_publicacao",
            "editora",
            "tipo",
            "quantidade",
            "edicao",
            "quantidade_disponivel",
        ]
        readonly_fields = ["quantidade_disponivel"]
