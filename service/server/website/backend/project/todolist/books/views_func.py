from django.db.models import Q


class BookListViewsFunc():
    def __init__(self, book):
        self.__book = book

    def retrieveUserData(self, current_user):
        return self.__book.objects.filter(user=current_user)

    def retrieveUserDataOrderBy(self, current_user, order_by, is_checked=False):
        if order_by == 'latest_created_first' or order_by is None:
            return self.__book.objects.filter(Q(user=current_user) & Q(is_read=is_checked)).order_by('-created_at')
        elif order_by == 'oldest_created_first':
            return self.__book.objects.filter(Q(user=current_user) & Q(is_read=is_checked)).order_by('created_at')
        elif order_by == 'will_due_date_first':
            return self.__book.objects.filter(Q(user=current_user) & Q(is_read=is_checked)).order_by('due_date')
        elif order_by == 'recent_last_modified_first':
            return self.__book.objects.filter(Q(user=current_user) & Q(is_read=is_checked)).order_by('-last_modify_date')
        elif order_by == 'oldest_last_modified_first':
            return self.__book.objects.filter(Q(user=current_user) & Q(is_read=is_checked)).order_by('last_modify_date')

    def checkUserIsExists(self, current_user):
        return self.__book.objects.filter(user=current_user).exists()

    # def checkTitleOrURLIsExists(self, **validated):
    #     return self.__book.objects.filter(Q(user=validated['user']) & (Q(title=validated['title']) | Q(url=validated['url']))).exists()

    def checkTitleOrURLIsExists(self, **validated):
        return {
            'is_title_exists': self.__book.objects.filter(Q(user=validated['user']) & (Q(title=validated['title']))).exists(),
            'is_url_exists': self.__book.objects.filter(Q(user=validated['user']) & (Q(url=validated['url']))).exists()
        }

    def filterTodoByUserAndId(self, **validated):
        # return self.__book.objects.filter(Q(user=validated['user']) & Q(id=validated['id'])).delete()
        return self.__book.objects.filter(Q(user=validated['user']) & Q(id=validated['id']))

    def updateTodoIsReadState(self, username, id):
        return self.__book.objects.filter(Q(user=username) & Q(id=id)).update(is_read=True)
    
    # can't auto update last_modify_date, if use modelName.objects.filter(...).update(...) method
    def updateTodoIsReadState(self, username, id, is_read):
        if not self.__book.objects.filter((Q(user=username) & Q(id=id)) & Q(is_read=is_read)).exists():
            return self.__book.objects.filter(Q(user=username) & Q(id=id)).update(is_read=is_read)

    def filterByUserAndId(self, username, id):
        return self.__book.objects.filter(Q(user=username) & Q(id=id))

    def checkDuplicateTitleOrURL(self, **validated):
        except_item = self.__book.objects.filter(Q(user=validated['user']) & ~Q(id=validated['id']))
        return {
            "is_title_exists": except_item.filter(title=validated['title']).exists(),
            "is_url_exists": except_item.filter(url=validated['url']).exists()
        }