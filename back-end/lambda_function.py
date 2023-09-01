# Import utils
from utils.util import create_response
from utils.auth import decode_auth_token, has_role
from utils.customTypes import Roles, User

# Import routes
from functions.users import login, register
from functions.movies import get_movie

API_VERSION = "/v1"


def lambda_handler(event, context):
    print(event)
    method = event["httpMethod"]
    # Ensure we only get the path after the API version
    path = event["path"].split(API_VERSION)[1]

    ### Public routes ###

    # Login
    if method == "POST" and path == "/users/login":
        return login(event, context)

    # Create user
    if method == "POST" and path == "/users/register":
        return register(event, context)

    ### Private routes ###

    # Check if Authorization header exists
    authToken = event["headers"].get("Authorization")
    if authToken is None:
        return create_response(401, "Authorization header missing")

    # Verify token
    (success, data) = decode_auth_token(authToken)

    if not success:
        return create_response(401, data)

    user: User = data

    if has_role(user, Roles.AWAITING_EMAIL_VERIFICATION):
        # TODO: add email verification
        return create_response(401, "Email not verified")

    # User Routes

    # TODO: add user routes

    # Movie Routes

    # TODO: add movie routes

    return create_response(404, "Route not found")
