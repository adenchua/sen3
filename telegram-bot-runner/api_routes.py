from constants import BACKEND_SERVICE_API_URL

_BASE = f"{BACKEND_SERVICE_API_URL}/api/v1"


def subscriber_url(user_id: str) -> str:
    """Return the URL for a specific subscriber by user ID."""
    return f"{_BASE}/subscribers/{user_id}"


def subscribers_url() -> str:
    """Return the base URL for the subscribers collection."""
    return f"{_BASE}/subscribers"


def subscriber_decks_url(user_id: str) -> str:
    """Return the URL for all decks belonging to a subscriber."""
    return f"{_BASE}/subscribers/{user_id}/decks"


def deck_url(deck_id: str) -> str:
    """Return the URL for a specific deck by deck ID."""
    return f"{_BASE}/decks/{deck_id}"


def decks_url() -> str:
    """Return the base URL for the decks collection."""
    return f"{_BASE}/decks"


def deck_templates_url() -> str:
    """Return the base URL for the deck templates collection."""
    return f"{_BASE}/deck-templates"


def deck_template_url(template_id: str) -> str:
    """Return the URL for a specific deck template by ID."""
    return f"{_BASE}/deck-templates/{template_id}"
