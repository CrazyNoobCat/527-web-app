# User API functions

from utils.util import (
    create_response,
    get_body,
    get_list_movies,
    get_list_reviews,
    has_required_fields,
    retrieve_paginated_list,
    safe_cast,
)
from utils.dbHelper import authenticate_user, create_user, get_movie, update_user
from utils.auth import generate_auth_token
from utils.customTypes import Review, User


def login(event, context):
    body = get_body(event)
    requiredFields = ["username", "password"]

    if not has_required_fields(body, requiredFields):
        return create_response(400, "Missing required fields")

    # Find matching user
    user = authenticate_user(body["username"], body["password"])

    if user is None:
        return create_response(401, "Invalid username or password")

    print("login: user: ", user)

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


def add_watchlist_movie(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    body = get_body(event)

    if body is None:
        return create_response(400, "Missing body")

    if body["id"] is None or body["id"] == "":
        return create_response(400, "Missing id")

    watchlist = user.watch_list.split(",")
    watchlist.append(body["id"])

    # Ensure no duplicates
    user.watch_list = ",".join(set(watchlist))

    # Remove comma if first element is empty
    if user.watch_list[0] == ",":
        user.watch_list = user.watch_list[1:]

    result, message = update_user(user)

    if result is False:
        return create_response(500, message)

    return create_response(200, "Watchlist updated")


def remove_watchlist_movie(event, context):
    pass


def get_watchlist(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    limit = safe_cast(params["limit"], int, 50)
    page = safe_cast(params["page"], int, 1)

    watchlist = user.watch_list.split(",")

    paginated_watchlist = retrieve_paginated_list(watchlist, limit, page)

    if paginated_watchlist == [""]:
        return create_response(200, body={"movies": []})

    movies = get_list_movies(paginated_watchlist)

    # Serialize the movies
    movies = [movie.__dict__ for movie in movies]

    return create_response(200, body={"movies": movies})


def add_watched_movie(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    body = get_body(event)

    if body is None:
        return create_response(400, "Missing body")

    if body["id"] is None or body["id"] == "":
        return create_response(400, "Missing id")

    watch_history = user.watch_history.split(",")
    watch_history.append(body["id"])

    user.watch_history = ",".join(set(watch_history))

    # Remove comma if first element is empty
    if user.watch_history[0] == ",":
        user.watch_history = user.watch_history[1:]

    result, message = update_user(user)

    if result is False:
        return create_response(500, message)

    return create_response(200, "Watch history updated")


def remove_watched_movie(event, context):
    pass


def get_watch_history(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    limit = safe_cast(params["limit"], int, 50)
    page = safe_cast(params["page"], int, 1)

    history = user.watch_history.split(",")
    paginated_history = retrieve_paginated_list(history, limit, page)

    print("paginated_history: ", paginated_history)

    if paginated_history == [""]:
        return create_response(200, body={"movies": []})

    movies = get_list_movies(paginated_history)

    # Serialize the movies
    movies = [movie.__dict__ for movie in movies]

    return create_response(200, body={"movies": movies})


def get_user_reviews(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    limit = safe_cast(params["limit"], int, 50)
    page = safe_cast(params["page"], int, 1)

    reviews = user.reviews.split(",")
    paginated_reviews = retrieve_paginated_list(reviews, limit, page)

    if paginated_reviews == [""]:
        return create_response(200, body={"reviews": []})

    reviews: list[Review] = get_list_reviews(paginated_reviews)

    return create_response(200, body={"reviews": reviews})


def create_review(event, context):
    pass


def update_review(event, context):
    pass


def delete_review(event, context):
    pass
