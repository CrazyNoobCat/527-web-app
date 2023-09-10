# Import utils
from utils.util import create_response
from utils.auth import decode_auth_token
from utils.customTypes import User

# Import routes
from functions.users import (
    add_watched_movie,
    add_watchlist_movie,
    get_user_reviews,
    get_watch_history,
    get_watchlist,
    remove_watchlist_movie,
    login,
    register,
    get_user,
    remove_watched_movie,
    create_review,
    delete_review,
)
from functions.movies import get_movie, get_movie_reviews, add_movie


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
    (success, data) = decode_auth_token(
        authToken
    )  # data is a User object with all details

    if not success:
        return create_response(401, data)

    user: User = data  # All details of the user

    # User Routes

    if method == "GET" and path == "/users":
        return get_user(event, context, user)

    if method == "GET" and path == "/users/watch/list":
        return get_watchlist(event, context, user)

    if method == "GET" and path == "/users/watch/history":
        return get_watch_history(event, context, user)

    if method == "GET" and path == "/users/reviews":
        return get_user_reviews(event, context, user)

    if method == "POST" and path == "/users/reviews":
        return create_review(event, context, user)

    if method == "POST" and path == "/users/watch/list":
        return add_watchlist_movie(event, context, user)

    if method == "POST" and path == "/users/watch/history":
        return add_watched_movie(event, context, user)

    if method == "DELETE" and path == "/users/watch/list":
        return remove_watchlist_movie(event, context, user)

    if method == "DELETE" and path == "/users/watch/history":
        return remove_watched_movie(event, context, user)

    if method == "DELETE" and path == "/users/reviews":
        return delete_review(event, context, user)

    # Movie Routes

    if method == "GET" and path == "/movies":
        return get_movie(event, context)

    if method == "GET" and path == "/movies/reviews":
        return get_movie_reviews(event, context)

    if method == "POST" and path == "/movies":
        return add_movie(event, context)

    return create_response(404, "Route not found")
