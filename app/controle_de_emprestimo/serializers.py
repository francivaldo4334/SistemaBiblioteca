from rest_framework.schemas.coreapi import serializers

from controle_de_emprestimo.models import AlunoRegistro, Emprestimo


class AlunoRegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlunoRegistro
        exclude = []


class EmprestimoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emprestimo
        fields = [
            "aluno",
            "livro",
            "data_retirada",
            "data_renovacao",
            "data_renovacao_2",
            "data_devolucao",
            "funcionario_responsavel",
        ]
        read_only_fields = ["funcionario_responsavel"]

    def get_fields(self):
        fields = super().get_fields()
        if self.instance is None:
            fields["data_devolucao"].read_only = True
            fields["data_renovacao_2"].read_only = True
        return fields

    def save(self, **kwargs):
        request = self.context.get("request")
        kwargs["funcionario_responsavel"] = request.user
        return super().save(**kwargs)
