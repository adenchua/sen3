import httpx

from logging_helper import logger


async def api_get(url: str, params: dict | None = None) -> dict | None:
    """
    Perform a GET request and return the parsed JSON response.

    Returns None on HTTP error or any unexpected exception.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)
    return None


async def api_post(url: str, body: dict) -> dict | None:
    """
    Perform a POST request with a JSON body and return the parsed JSON response.

    Returns None on HTTP error or any unexpected exception.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=body)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)
    return None


async def api_patch(url: str, body: dict) -> dict | None:
    """
    Perform a PATCH request with a JSON body and return the parsed JSON response.

    Returns None on HTTP error or any unexpected exception.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.patch(url, json=body)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)
    return None


async def api_delete(url: str) -> bool:
    """
    Perform a DELETE request.

    Returns True on success, False on HTTP error or any unexpected exception.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.delete(url)
            response.raise_for_status()
            return True
        except httpx.HTTPStatusError as http_error:
            logger.error(f"http error: {http_error}")
        except Exception as error:
            logger.error(error)
    return False
