import secrets


def get_token() -> str:
    return secrets.token_urlsafe(64)
