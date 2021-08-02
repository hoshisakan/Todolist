from django.db import models
from django.core.validators import URLValidator
from django.contrib.auth.models import User

# Create your models here.
class BookList(models.Model):
    # on_delete 避免 user 與 book_list 兩個資料表資料不一致而產生錯誤
    user = models.ForeignKey(User, related_name='book_items', on_delete=models.CASCADE, null=False, blank=False, to_field='username')
    title = models.CharField(max_length=1024)
    # title = models.TextField(null=False, blank=False, unique=True)
    author = models.CharField(max_length=30, null=False, blank=False)
    price = models.FloatField(null=False, blank=False)
    nationality = models.CharField(max_length=10, null=False, blank=False)
    # url = models.URLField(max_length=250, null=False, blank=False, unique=True)
    url = models.CharField(max_length=1024 ,validators=[URLValidator], null=False, blank=False)
    due_date = models.DateField(null=False, blank=False)
    is_read = models.BooleanField(null=False, blank=True, default=False)
    last_modify_date = models.DateTimeField(auto_now=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        db_table = 'book_todo_list'
        app_label = 'books'
        ordering = ['-created_at']