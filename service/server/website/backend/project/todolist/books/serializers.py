from .models import BookList
from django.contrib.auth.models import User
from rest_framework import serializers
from django.utils.timezone import now

class BookListSerializer(serializers.ModelSerializer):
    days_since_created = serializers.SerializerMethodField()

    class Meta:
        model = BookList
        fields = ['id', 'user', 'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'days_since_created', 'last_modify_date', 'created_at']

    def get_days_since_created(self, obj):
        return (now() - obj.created_at).days

class RetrieveBookTodoSerializer(serializers.ModelSerializer):
    days_since_created = serializers.SerializerMethodField()
    # user = serializers.SlugRelatedField(queryset=User.objects.all(), slug_field='username')

    class Meta:
        model = BookList
        fields = ['id', 'title', 'author', 'price', 'nationality', 'url', 'due_date', 'is_read' , 'days_since_created', 'last_modify_date', 'created_at']

    def get_days_since_created(self, obj):
        return (now() - obj.created_at).days

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