from datetime import datetime


def get_current_datetime_iso():
    """Retrieves the current datetime in ISO string"""
    return datetime.now().isoformat()


def wrap_response(data):
    """Wraps a response payload with a data field"""
    return {"data": data, "status": "success", "datetime": get_current_datetime_iso()}


def wrap_error(message, status_code):
    """
    Wraps an error message in the standard envelope.

    Mirrors wrap_response so error responses carry the same status/datetime
    shape as successful ones. Returns the envelope dict (the caller is
    responsible for attaching the HTTP status code).
    """
    return {
        "error": message,
        "status_code": status_code,
        "status": "error",
        "datetime": get_current_datetime_iso(),
    }
