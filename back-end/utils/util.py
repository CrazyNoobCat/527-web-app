# Utility functions
import json


def get_body(event) -> dict:
    return json.loads(event["body"])


def create_response(
    status_code: int,
    message: str,
    header: dict[str, str] = None,
    body: dict[str, str] = None,
):
    """Create a response object"""
    if header is None:
        header = {}
    if body is None:
        body = {}

    body["message"] = message

    response = {
        "statusCode": status_code,
        "headers": header,
        "body": json.dumps(body),
    }

    print(response)

    return response


def has_required_fields(body: dict, fields: list[str]) -> bool:
    """Check if the body has the required fields"""
    for field in fields:
        if body.get(field) is None:
            return False

    return True
