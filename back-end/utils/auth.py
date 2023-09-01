import datetime
import jwt
import boto3
import json
from .customTypes import User, Roles
from .dbHelper import get_user_by_username

TOKEN_EXPIRATION_TIME = 1  # hours


def get_secret():
    # TODO: Implement caching: https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html
    client = boto3.client("secretsmanager")
    response = client.get_secret_value(SecretId="JWT_SECRET_KEY")

    return response["SecretString"]


def generate_auth_header(username: str):
    """Generates the Auth Token and returns it as a header dictionary with an Authorization token"""
    try:
        payload = {
            "username": username,
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(hours=TOKEN_EXPIRATION_TIME),
        }

        header = {"Authorization": f"Bearer {jwt.encode(payload, get_secret())}"}

        return header
    except Exception as e:
        # TODO: log error
        return None


def decode_auth_token(auth_token: str):
    """Decodes the auth token and returns a tuple indicating success and the user details or error message"""
    try:
        # TODO: log token use

        auth_token = auth_token.replace("Bearer ", "")
        payload = jwt.decode(auth_token.encode(), get_secret())

        # Check expiration
        if datetime.datetime.utcnow() > datetime.datetime.fromtimestamp(payload["exp"]):
            return (False, "Token expired")

        user = get_user_by_username(payload["username"])

        if user is None:
            return (False, "User not found")

        return (True, user)

    except jwt.ExpiredSignatureError:
        # TODO: log error
        return (False, "Signature expired. Please log in again.")
    except jwt.InvalidTokenError:
        # TODO: log error
        return (False, "Invalid token. Please log in again.")


def has_role(user: User, role: str) -> bool:
    """Check if the user has the required role or is an admin"""
    if user.role == Roles.ADMIN:
        return True

    return user.role == role
