import re


def is_safe_opensearch_query_string(input_str: str) -> bool:
    """
    Validates that the input string contains only safe characters to prevent
    OpenSearch query string injection.

    Allowed characters:
    - Letters (a-z, A-Z)
    - Numbers (0-9)
    - Spaces
    - Basic punctuation: comma (,), period (.), hyphen (-), underscore (_)

    Disallowed characters include all OpenSearch query operators and special chars.

    Returns True if input is safe, False otherwise.
    """
    # Regex pattern: only allow letters, digits, spaces, comma, period, hyphen, underscore
    pattern = r"^[a-zA-Z0-9\s,._-]+$"
    return bool(re.fullmatch(pattern, input_str))


def format_keywords(input_str: str) -> str:
    items = [item.strip() for item in input_str.split(",")]
    return "\n".join(f"- {item}" for item in items)


def clean_and_join(input_str: str) -> str:
    items = [item.strip() for item in input_str.split(",")]
    return ",".join(items)
