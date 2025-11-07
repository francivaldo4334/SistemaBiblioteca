from django.db.models.signals import post_save
from django.dispatch import receiver

from controle_de_emprestimo.models import Emprestimo


@receiver(post_save, sender=Emprestimo)
def regra_de_atualizar_quantidade_de_livros_disponiveis(
    sender,
    instance: Emprestimo,
    **kwargs,
):
    quantidade_disponivel = Emprestimo.objects.filter(  # type: ignore
        livro=instance.livro, data_devolucao__isnull=True
    ).count()

    instance.livro.quantidade_disponivel = quantidade_disponivel  # type: ignore
    instance.livro.save()  # type: ignore
