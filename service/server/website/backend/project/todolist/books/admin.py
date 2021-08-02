from django.contrib import admin
from .models import BookList

# Register your models here.
@admin.register(BookList)
class BookListAdmin(admin.ModelAdmin):
    fields = ('user', 'title', 'author', 'price', 'is_read', 'nationality', 'url')