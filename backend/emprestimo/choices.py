from django.db.models import TextChoices


class LoanState(TextChoices):
    OBTENDED = "OBT", "Obtido"
    RETURNED = "RTN", "Retornado"
    POSTPONED = "PPD", "Adiado"
