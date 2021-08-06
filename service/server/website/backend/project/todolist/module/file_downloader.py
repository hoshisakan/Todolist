from django.http.response import HttpResponse
import csv

class FileDownloader():
    def __init__(self):
        pass

    def export_csv_by_http_response(self, **export):
        response = HttpResponse(content_type='text/csv')
        export_filename = export['filename']
        response['Content-Disposition'] = f'attachment; filename="{export_filename}.csv"'
        response.write(u'\ufeff'.encode('utf-8'))
        writer = csv.writer(response, delimiter=',')
        write_rows = []

        if export['serializer_data'] is not None:
            write_rows = [list(field.values()) for field in export['serializer_data']]
        write_rows.insert(0, export['write_columns'])
        writer.writerows(write_rows)
        return response

    def export_csv_by_stream_response(self):
        pass