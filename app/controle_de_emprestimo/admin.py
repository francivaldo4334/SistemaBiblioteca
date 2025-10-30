from django.contrib import admin

from controle_de_emprestimo.models import AlunoRegistro, Emprestimo


@admin.register(AlunoRegistro)
class AlunoRegistroAdmin(admin.ModelAdmin):
    search_fields = ["nome", "metricula"]


@admin.register(Emprestimo)
class EmprestimoAdmin(admin.ModelAdmin):
    list_display = ["aluno", "livro", "data_devolucao"]
    readonly_fields = ["funcionario_responsavel"]
    autocomplete_fields = ["aluno", "livro"]
    fields = [
        "aluno",
        "livro",
        "data_retirada",
        "data_renovacao",
        "data_renovacao_2",
        "data_devolucao",
        "funcionario_responsavel",
    ]
    actions = ["action_devolver_livro"]

    def get_readonly_fields(self, request, obj=None):  # type:ignore
        if obj is None:
            return ["data_devolucao", "data_renovacao_2", *self.readonly_fields]
        return self.readonly_fields

    def save_model(self, request, obj, form, change):
        if not change:
            obj.funcionario_responsavel = request.user
        return super().save_model(request, obj, form, change)

    def action_devolver_livro(self, request, queryset):
        updated_count = 0
        for emprestimo in queryset:
            if emprestimo.devolver_livro():
                updated_count += 1
        self.message_user(
            request, f"{updated_count} livro(s) marcado(s) como devolvido(s)."
        )

    action_devolver_livro.short_description = (  # type: ignore
        "Marcar livros selecionados como devolvidos"
    )
