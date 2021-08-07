from .models import BookList
from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils.timezone import now, localtime
from module.date import DateTimeTools as DT


class BookListSerializer(serializers.ModelSerializer):
    days_since_created = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['id', 'user', 'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'days_since_created', 'last_modify_date', 'created_at']

    def get_days_since_created(self, obj):
        return (now() - obj.created_at).days

class RetrieveBookTodoSerializer(serializers.ModelSerializer):
    days_since_created = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['id', 'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'days_since_created', 'last_modify_date', 'created_at']

    def get_days_since_created(self, obj):
        return (now() - obj.created_at).days

class RetrieveUnDoneBookTodoSerializer(serializers.ModelSerializer):
    days_since_created = serializers.SerializerMethodField()
    due_days = serializers.SerializerMethodField()
    will_due_days = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['id', 'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'days_since_created', 'last_modify_date', 'created_at', 'due_days', 'will_due_days']

    def get_days_since_created(self, obj):
        return (now() - obj.created_at).days

    def get_due_days(self, obj):
        obtain_due_days = (localtime(now()).date() - obj.due_date).days
        due_days = 0 if obtain_due_days < 1 else obtain_due_days
        return due_days

    def get_will_due_days(self, obj):
        obtain_will_due_days = (obj.due_date - localtime(now()).date()).days
        will_due_days = 0 if obtain_will_due_days < 1 else obtain_will_due_days
        return will_due_days

class RetrieveCompletedBookTodoSerializer(serializers.ModelSerializer):
    days_since_created = serializers.SerializerMethodField()
    due_days = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['id', 'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'days_since_created', 'last_modify_date', 'created_at', 'due_days']

    def get_days_since_created(self, obj):
        return (now() - obj.created_at).days

    def get_due_days(self, obj):
        obtain_due_days = (localtime(now()).date() - obj.due_date).days
        due_days = 0 if obtain_due_days < 1 else obtain_due_days
        return due_days

class AddBookTodoSerializer(serializers.ModelSerializer):
    days_since_created = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        # fields = ['id', 'user' ,'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'days_since_created', 'last_modify_date', 'created_at']
        fields = ['id', 'user' ,'title', 'author', 'price', 'nationality', 'url', 'due_date', 'days_since_created', 'last_modify_date', 'created_at']

    def get_days_since_created(self, obj):
        return (now() - obj.created_at).days

class UpdateBookTodoSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')

    class Meta:
        model = BookList
        fields = ['id', 'user' ,'title', 'author', 'price', 'nationality', 'url', 'due_date', 'last_modify_date']
        # fields = ['id', 'user' ,'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read', 'last_modify_date']

class UpdateBookTodoIsReadSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')

    class Meta:
        model = BookList
        fields = ['user', 'is_read']

class ExportUnDoneBookTodoSerializer(serializers.ModelSerializer):
    is_read = serializers.SerializerMethodField()
    last_modify_date= serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    due_days = serializers.SerializerMethodField()
    will_due_days = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read', 'last_modify_date', 'created_at', 'due_days', 'will_due_days']

    def get_is_read(self, obj):
        return 'Unread' if obj.is_read is False else 'Read'

    def get_last_modify_date(self, obj):
        return DT.format_local_datetime_to_str(obj.last_modify_date)

    def get_created_at(self, obj):
        return DT.format_local_datetime_to_str(obj.created_at)

    def get_due_days(self, obj):
        obtain_due_days = (localtime(now()).date() - obj.due_date).days
        due_days = 0 if obtain_due_days < 1 else obtain_due_days
        return due_days

    def get_will_due_days(self, obj):
        obtain_will_due_days = (obj.due_date - localtime(now()).date()).days
        will_due_days = 0 if obtain_will_due_days < 1 else obtain_will_due_days
        return will_due_days

class ExportCompletedBookTodoSerializer(serializers.ModelSerializer):
    is_read = serializers.SerializerMethodField()
    last_modify_date= serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    due_days = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'last_modify_date', 'created_at', 'due_days']

    def get_is_read(self, obj):
        return 'Unread' if obj.is_read is False else 'Read'

    def get_last_modify_date(self, obj):
        return DT.format_local_datetime_to_str(obj.last_modify_date)

    def get_created_at(self, obj):
        return DT.format_local_datetime_to_str(obj.created_at)

    def get_due_days(self, obj):
        obtain_due_days = (localtime(now()).date() - obj.due_date).days
        due_days = 0 if obtain_due_days < 1 else obtain_due_days
        return due_days