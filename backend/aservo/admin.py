from django.contrib import admin

from aservo.models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    pass
