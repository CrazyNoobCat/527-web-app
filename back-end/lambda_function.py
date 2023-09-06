# Import utils
from utils.util import create_response
from utils.auth import decode_auth_token
from utils.customTypes import User

# Import routes
from functions.users import get_watch_history, get_watchlist, login, register, get_user
from functions.movies import get_movie


def lambda_handler(event, context):
    print(event)
    method = event["httpMethod"]
    # Ensure we only get the path after the API version
    path = event["path"]

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
    (success, data) = decode_auth_token(authToken) # data is a User object with all details

    if not success:
        return create_response(401, data)

    user: User = data # All details of the user

    # User Routes

    if method == "GET" and path == "/users":
        return get_user(event, context, user)
    
    if method == "GET" and path == "/users/watch/list":
        return get_watchlist(event, context, user)
    
    if method == "GET" and path == "/users/watch/history":
        return get_watch_history(event, context, user)

    # Movie Routes

    if method == "GET" and path == "/movies":
        return get_movie(event, context)

    # TODO: add movie routes

    return create_response(404, "Route not found")
