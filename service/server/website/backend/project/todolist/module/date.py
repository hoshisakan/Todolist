import datetime
from datetime import datetime as dt
import pytz, dateutil.parser
import pandas as pd

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
    def format_date_str(format_datetime):
        return format_datetime.strftime("%Y-%m-%d")

    @classmethod
    def format_local_datetime_to_str(cls, format_datetime):
        # return cls.format_datetime_str(format_datetime + cls.obtain_hours_datetime(8))
        utctime = dateutil.parser.parse(cls.format_datetime_str(format_datetime + cls.obtain_hours_datetime(8)))
        return utctime.astimezone(pytz.timezone("Asia/Taipei"))

    @staticmethod
    def format_second_str(format_datetime):
        return format_datetime.strftime("%S")

    @staticmethod
    def convert_timestamp_to_datetime(timestamp):
        return dt.fromtimestamp(timestamp)
