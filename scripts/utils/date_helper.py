from datetime import datetime, timezone


def convert_to_iso(date_str: str | None):
    """Converts a date time to ISO string"""
    if date_str is None:
        return None

    input_format = "%a, %d %b %Y %H:%M:%S GMT"

    dt_obj = datetime.strptime(date_str, input_format)
    dt_obj = dt_obj.replace(tzinfo=timezone.utc)
    iso_str = dt_obj.isoformat()

    return iso_str


def get_current_datetime_iso():
    """Retrieves the current datetime in ISO string"""
    return datetime.now().isoformat()
