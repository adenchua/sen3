from datetime import datetime


def get_current_datetime_iso():
    """Retrieves the current datetime in ISO string"""
    return datetime.now().isoformat()


def wrap_response(data):
    """Wraps a response payload with a data field"""
    return {"data": data, "status": "success", "datetime": get_current_datetime_iso()}
