import datetime
from datetime import datetime as dt

class DateTimeTools():
    @staticmethod
    def obtain_days_datetime(value):
        return datetime.timedelta(days=value)

    @staticmethod
    def obtain_hours_datetime(value):
        return datetime.timedelta(hours=value)

    @staticmethod
    def obtain_minutes_datetime(value):
        return datetime.timedelta(minutes=value)

    @staticmethod
    def obtain_seconds_datetime(value):
        return datetime.timedelta(seconds=value)

    @staticmethod
    def get_current_datetime():
        return dt.now()

    @staticmethod
    def format_datetime_str(format_datetime):
        return format_datetime.strftime("%Y-%m-%d %H:%M:%S")

    @staticmethod
    def format_second_str(format_datetime):
        return format_datetime.strftime("%S")

    @staticmethod
    def convert_timestamp_to_datetime(timestamp):
        return dt.fromtimestamp(timestamp)
