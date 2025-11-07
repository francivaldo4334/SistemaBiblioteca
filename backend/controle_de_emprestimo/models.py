from django.db import models
from acervo_de_livros.models import LivroRegistro
from django.conf import settings
from datetime import date


class AlunoRegistro(models.Model):
    nome = models.CharField(
        verbose_name="Nome do aluno",
    )
    metricula = models.CharField(
        verbose_name="Matrícula do aluno",
    )

    class Meta:
        verbose_name = "Aluno Registrado"
        verbose_name_plural = "Alunos Registrados"

    def __str__(self):
        return f"{self.nome} {self.metricula}"


class Emprestimo(models.Model):
    aluno = models.ForeignKey(
        AlunoRegistro,
        on_delete=models.CASCADE,
        verbose_name="Aluno que solicitou o livro",
    )
    livro = models.ForeignKey(
        LivroRegistro,
        on_delete=models.CASCADE,
        verbose_name="Livro solicitado pelo aluno",
        help_text="Esse valor faz referência a um livro registrado no módulo de 'Acervo de livros'.",
    )
    data_retirada = models.DateField(
        verbose_name="Data de retirada do livro",
    )
    data_renovacao = models.DateField(
        verbose_name="Data programada para a renovação do emprestimo do livro",
    )
    data_renovacao_2 = models.DateField(
        verbose_name="Segunda data para a renovação do emprestimo do livro",
        help_text="Em caso de a primeira data de renovação não ter sido efetivada.",
        blank=True,
        null=True,
    )
    data_devolucao = models.DateField(
        verbose_name="Data da devolução",
        help_text="Data em que o aluno devolveu o livro requisitado.",
        blank=True,
        null=True,
    )
    funcionario_responsavel = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Funcionário responsável",
    )

    def __str__(self):
        return f"{self.aluno} -> {self.livro}"

    def devolver_livro(self):
        if self.data_devolucao:
            return False
        self.data_devolucao = date.today()
        self.save()
        return True
