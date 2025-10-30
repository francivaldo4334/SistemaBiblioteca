from django.apps import AppConfig


class ControleDeEmprestimoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "controle_de_emprestimo"

    def ready(self):
        import controle_de_emprestimo.signals
