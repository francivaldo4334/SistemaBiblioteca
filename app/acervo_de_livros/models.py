from django.db import models
from django.core.validators import MinValueValidator, integer_validator
import isbnlib


class TipoLivro(models.Model):
    tipo = models.CharField(
        verbose_name="Nome do tipo de livro",
        help_text="Indica o tipo de livro ex: Quadrinho, Crônica brasileira, ect",
    )


def valida_codigo_isbn(value):
    is_sbn10 = isbnlib.is_isbn10(value)
    is_sbn13 = isbnlib.is_isbn13(value)
    return is_sbn10 or is_sbn13


class LivroRegistro(models.Model):
    isbn = models.CharField(
        verbose_name="Código ISBN do livro",
        help_text="Digite um ISBN válido (ex: 978-85-12345-67-8 ou 85-12345-67-X)",
        max_length=20,
        unique=True,
        validators=[valida_codigo_isbn],
    )
    titulo = models.CharField(
        verbose_name="Título do livro",
    )
    quantidade = models.PositiveIntegerField(
        verbose_name="Quantidade de cópias",
        validators=[
            MinValueValidator(1),
        ],
    )
    autores = models.CharField(
        verbose_name="Autor(es)",
        help_text="Autor ou autores do livro",
    )
    tipo = models.ForeignKey(
        TipoLivro,
        on_delete=models.CASCADE,
    )
    edicao = models.PositiveIntegerField(
        verbose_name="Número da edição",
        validators=[
            MinValueValidator(1),
        ],
    )
    ano_publicacao = models.CharField(
        verbose_name="Ano da públicação do livro",
        validators=[integer_validator],
    )
    editora = models.CharField(
        verbose_name="Editora do livro",
        blank=True,
        null=True,
    )
