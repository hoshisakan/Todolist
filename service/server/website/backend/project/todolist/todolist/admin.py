from django.contrib.admin import AdminSite
from books.models import BookList

class BookAdminSite(AdminSite):
    site_header = 'Book List Admin'

book_list_admin = BookAdminSite(name='books_admin')
book_models = [BookList]
book_list_admin.register(book_models)