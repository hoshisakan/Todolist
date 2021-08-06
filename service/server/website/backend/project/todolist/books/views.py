from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework import viewsets, status
from .models import BookList
from rest_framework.parsers import JSONParser
from .serializers import AddBookTodoSerializer, RetrieveBookTodoSerializer, UpdateBookTodoSerializer, \
                        UpdateBookTodoIsReadSerializer, RetrieveUnDoneBookTodoSerializer, RetrieveCompletedBookTodoSerializer, \
                        ExportUnDoneBookTodoSerializer, ExportCompletedBookTodoSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .views_func import BookListViewsFunc
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from module.file_downloader import FileDownloader


# Create your views here.
class BookListViewset(viewsets.ModelViewSet):
    queryset = BookList.objects.all()
    serializer_class = RetrieveBookTodoSerializer
    parsers_classes = (JSONParser,)
    viewset_func = BookListViewsFunc(BookList)

    def list(self, request):
        try:
            data = request.query_params
            is_checked = data.get('is_checked', None)
            order_by = data.get('order_by', None)
            if is_checked == 'true':
                queryset = self.viewset_func.retrieveUserDataOrderBy(request.user, order_by, True)
                serializer = RetrieveCompletedBookTodoSerializer(queryset, many=True)
            else:
                queryset = self.viewset_func.retrieveUserDataOrderBy(request.user, order_by, False)
                serializer = RetrieveUnDoneBookTodoSerializer(queryset, many=True)
            res_msg = {
                "info": serializer.data
            }
            return Response(res_msg, status=status.HTTP_200_OK)
        except Exception as e:
            res_msg = {
                "error": e.args[0],
                "message": "get data failed."
            }
            return Response(res_msg, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        data = request.data
        try:
            data["user"] = request.user
            duplicate_check = self.viewset_func.checkTitleOrURLIsExists(
                user=request.user,
                title=data['title'],
                url=data['url']
            )
            if any(list(duplicate_check.values())):
                raise Exception(duplicate_check)
            serializer = AddBookTodoSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            res_msg = {
                "info": serializer.data,
                "message": "add todo successfully!",
                "is_writed": True
            }
            return Response(res_msg, status=status.HTTP_201_CREATED)
        except Exception as e:
            res_msg = {
                "error": e.args[0],
                "message": "write data failed.",
                "is_writed": False
            }
            return Response(res_msg, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            queryset = self.viewset_func.filterByUserAndId(str(request.user), pk)
            serializer = RetrieveBookTodoSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            res_msg = {
                "error": e.args[0],
                "message": "partial update data failed.",
                "is_partial_updated": False
            }
            return Response(res_msg, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            data = request.data
            data['user'] = request.user
            duplicate_check = self.viewset_func.checkDuplicateTitleOrURL(
                user=request.user,
                id=pk,
                title=data['title'],
                url=data['url']
            )
            if any(list(duplicate_check.values())):
                raise Exception(duplicate_check)
            queryset = self.viewset_func.filterTodoByUserAndId(
                user=request.user,
                id=pk
            )
            instance = get_object_or_404(queryset)
            self.serializer_class = UpdateBookTodoSerializer
            serializer = self.get_serializer(instance, data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            res_msg = {
                "message": "update data successfully!",
                "is_updated": True
            }
            return Response(res_msg, status=status.HTTP_200_OK)
        except Exception as e:
            res_msg = {
                "error": e.args[0],
                "message": "update data failed.",
                "is_updated": False
            }
            return Response(res_msg, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, pk=None):
        try:
            data = request.data
            if data['is_read'] is None:
                raise Exception("The is_read field required")
            data['user'] = request.user
            queryset = self.viewset_func.filterByUserAndId(data['user'], pk)
            instance = get_object_or_404(queryset)
            self.serializer_class = UpdateBookTodoIsReadSerializer
            serializer = self.serializer_class(instance, data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            res_msg = {
                "info": "update todo item successfully",
                "is_checked": True
            }
            return Response(res_msg, status=status.HTTP_200_OK)
        except Exception as e:
            res_msg = {
                "error": e.args[0],
                "message": "partial update data failed.",
                "is_checked": False
            }
            print(res_msg)
            return Response(res_msg, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            queryset = self.viewset_func.filterTodoByUserAndId(
                user=request.user,
                id=pk
            )
            instance = get_object_or_404(queryset)
            self.perform_destroy(instance)
            res_msg = {
                "info": f"remove {pk} book todo.",
                "message": "delete data successfully!",
                "is_deleted": True
            }
            return Response(res_msg, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            res_msg = {
                "error": e.args[0],
                "message": "delete data failed.",
                "is_deleted": False
            }
            return Response(res_msg, status=status.HTTP_400_BAD_REQUEST)

    # if setting.py " DEFAULT_PERMISSION_CLASSES " not set " IsAuthenticated ", then permission_classes must add " IsAuthenticated "
    # @action(methods=['POST'], detail=False, url_path='export-todo', permission_classes=[IsAuthenticated])
    @action(methods=['GET'], detail=False, url_path='export-todo')
    def export_todo(self, request):
        try:
            data = request.query_params
            is_checked = data.get('is_checked', None)
            order_by = data.get('order_by', None)
            export_type = data.get('export_type', None)

            if is_checked is None or order_by is None or export_type is None:
                raise Exception('The field is checked and order by and export type can not be empty')

            if is_checked == 'true':
                queryset = self.viewset_func.retrieveUserDataOrderBy(request.user, order_by, True)
                serializer = ExportCompletedBookTodoSerializer(queryset, many=True)
                write_columns = ['Title', 'author', 'Price', 'Nationality', 'Link', 'Due Date', 'Is Read?', 'Last Completed Date', 'Created At', 'Due Days']
            else:
                queryset = self.viewset_func.retrieveUserDataOrderBy(request.user, order_by, False)
                serializer = ExportUnDoneBookTodoSerializer(queryset, many=True)
                write_columns = ['Title', 'Author', 'Price', 'Nationality', 'Link', 'Due Date', 'Is Read?', 'Last Modified Date', 'Created At', 'Due Days', 'Will Due Days']

            if export_type == 'csv':
                file_downloader = FileDownloader()
                export_info = file_downloader.export_csv_by_http_response(
                    filename="default_todo_list_data",
                    write_columns=write_columns,
                    serializer_data=serializer.data
                )
            return export_info
            # return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            res_msg = {
                "error": e.args[0],
                "message": "export data failed.",
            }
            print(res_msg)
            return Response(res_msg, status=status.HTTP_400_BAD_REQUEST)
