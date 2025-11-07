from rest_framework import serializers

from acervo_de_livros.models import LivroRegistro


class LivroRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = LivroRegistro
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
        read_only_fields = ["quantidade_disponivel"]
