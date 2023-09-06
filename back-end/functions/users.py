# User API functions

from utils.util import create_response, get_body, has_required_fields
from utils.dbHelper import authenticate_user, create_user, get_movie
from utils.auth import generate_auth_token
from utils.customTypes import User


def login(event, context):
    body = get_body(event)
    requiredFields = ["username", "password"]

    if not has_required_fields(body, requiredFields):
        return create_response(400, "Missing required fields")

    # Find matching user
    user = authenticate_user(body["username"], body["password"])

    if user is None:
        return create_response(401, "Invalid username or password")

    # Generate auth token
    authToken = generate_auth_token(user.username)

    if authToken is None:
        return create_response(500, "Error generating auth token")

    return create_response(200, "Login successful", body=authToken)


def register(event, context):
    # TODO: Add route logs
    body = get_body(event)
    requiredFields = ["username", "password", "email"]

    if not has_required_fields(body, requiredFields):
        return create_response(400, "Missing required fields")

    (success, message) = create_user(body["username"], body["email"], body["password"])

    if not success:
        return create_response(400, message)

    return create_response(201, message)


def get_user(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    return create_response(200, body={"username": user.username, "email": user.email})


def update_user(event, context):
    pass


def add_watchlist_movie(event, context):
    pass


def remove_watchlist_movie(event, context):
    pass


def get_watchlist(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    limit = params["limit"] if params["limit"] else 50
    page = params["page"] if params["page"] else 0

    # Paginate the watchlist
    watchlist = user.watch_list.split(",")
    start = limit * page

    if start >= len(watchlist):
        return create_response(200, body={"movies": []})

    end = min(limit * (page + 1), len(watchlist))

    paginated_watchlist = watchlist[start:end]

    # Retrieved paginated watchlist movies
    movies = []

    for movie_id in paginated_watchlist:
        movie = get_movie(movie_id)
        if movie is not None:
            movies.append(movie)
        else:
            # Add another movie from the watch list
            end += 1
            if end < len(watchlist):
                paginated_watchlist.append(watchlist[end : end + 1])

    return create_response(200, body={"movies": movies})


def add_watched_movie(event, context):
    pass


def remove_watched_movie(event, context):
    pass


def get_watched_movies(event, context):
    pass


def create_review(event, context):
    pass


def update_review(event, context):
    pass


def delete_review(event, context):
    pass
