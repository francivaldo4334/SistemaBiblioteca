from django.db import models
from isbn_field import ISBNField
from django_extensions.db.models import TimeStampedModel

from aservo.managers import BookManager


class Book(TimeStampedModel):
    objects = BookManager() 
    
    image = models.ImageField(blank=True, null=True)
    title = models.CharField()
    isbn = ISBNField()
    quantity = models.PositiveIntegerField()
    authors = models.CharField()
    book_type = models.CharField()
    publish_date = models.CharField(blank=True, null=True)
    publisher = models.CharField(blank=True, null=True)
