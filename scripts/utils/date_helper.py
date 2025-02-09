from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo


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


def adjust_to_24_hours_ago(iso_string: str | None):
    """
    Helper function that receives an utc iso string.
    If the iso string is > 24 hours ago or None, set it to
    exactly 24hrs ago and return it back to the caller
    """
    current_time = datetime.now(ZoneInfo("UTC"))
    # Set the time to 24 hours ago
    adjusted_time = current_time - timedelta(hours=24)

    if iso_string is None:
        return adjusted_time.isoformat()

    # Parse the input ISO string into a datetime object
    input_time = datetime.fromisoformat(iso_string).replace(tzinfo=ZoneInfo("UTC"))

    # Check if the input time is more than 24 hours ago
    if current_time - input_time > timedelta(hours=24):
        return adjusted_time.isoformat()

    # input time less than 24 hrs ago, return input time
    return input_time.isoformat()
