# User API functions

from utils.util import (
    create_response,
    get_body,
    get_list_movies,
    get_list_reviews,
    ordered_set,
    retrieve_page_and_limit,
    retrieve_paginated_list,
    safe_cast,
    serialize_review,
)
from utils.dbHelper import (
    authenticate_user,
    create_user,
    get_review,
    update_user,
    get_movie,
    create_user_review,
    remove_user_review,
)
from utils.auth import generate_auth_token
from utils.customTypes import Review, User


def login(event, context):
    body = get_body(event)
    requiredFields = ["username", "password"]

    username = safe_cast(body, "username", str, "")
    password = safe_cast(body, "password", str, "")

    if username == "" or password == "":
        return create_response(400, "Missing required fields")

    # Find matching user
    user = authenticate_user(username, password)

    if user is None:
        return create_response(401, "Invalid username or password")

    print("login: user: ", user)

    # Generate auth token
    authToken = generate_auth_token(user.username)

    if authToken is None:
        return create_response(500, "Error generating auth token")

    return create_response(200, "Login successful", body=authToken)


def register(event, context):
    body = get_body(event)

    username = safe_cast(body, "username", str, "")
    password = safe_cast(body, "password", str, "")
    email = safe_cast(body, "email", str, "")

    if username == "" or password == "" or email == "":
        return create_response(400, "Missing required fields")

    (success, message) = create_user(username=username, password=password, email=email)

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

    id = safe_cast(body, "id", str, "")

    if id == "":
        return create_response(400, "Missing valid id")

    watchlist = user.watch_list.split(",")
    watchlist.append(id)

    # Ensure no duplicates
    user.watch_list = ",".join(ordered_set(watchlist))

    # Remove comma if first element is empty
    if user.watch_list[0] == ",":
        user.watch_list = user.watch_list[1:]

    result, message = update_user(user)

    if result is False:
        return create_response(500, message)

    return create_response(200, "Watchlist updated")


def remove_watchlist_movie(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]
    id = safe_cast(params, "id", str, "")

    if id == "":
        return create_response(400, "Missing valid id")

    watchlist = user.watch_list.split(",")

    if id in watchlist:
        watchlist.remove(id)
    else:
        return create_response(400, "Movie not in watchlist")

    user.watch_list = ",".join(ordered_set(watchlist))

    # Remove comma if first element is empty
    if len(user.watch_list) != 0:
        if user.watch_list[0] == ",":
            user.watch_list = user.watch_list[1:]

    result, message = update_user(user)

    if result is False:
        return create_response(500, message)

    return create_response(200, "Watchlist updated")


def get_watchlist(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    page, limit = retrieve_page_and_limit(params)

    watchlist = user.watch_list.split(",")

    # Order from newest to oldest
    watchlist.reverse()

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

    id = safe_cast(body, "id", str, "")

    if id == "":
        return create_response(400, "Missing valid id")

    watch_history = user.watch_history.split(",")
    watch_history.append(id)

    user.watch_history = ",".join(ordered_set(watch_history))

    # Remove comma if first element is empty
    if user.watch_history[0] == ",":
        user.watch_history = user.watch_history[1:]

    result, message = update_user(user)

    if result is False:
        return create_response(500, message)

    return create_response(200, "Watch history updated")


def remove_watched_movie(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    id = safe_cast(params, "id", str, "")

    if id == "":
        return create_response(400, "Missing id")

    history = user.watch_history.split(",")

    if id in history:
        history.remove(id)
    else:
        return create_response(400, "Movie not in history")

    user.watch_history = ",".join(ordered_set(history))

    # Remove comma if first element is empty
    if len(user.watch_history) != 0:
        if user.watch_history[0] == ",":
            user.watch_history = user.watch_history[1:]

    result, message = update_user(user)

    if result is False:
        return create_response(500, message)

    return create_response(200, "History updated")


def get_watch_history(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    page, limit = retrieve_page_and_limit(params)

    history = user.watch_history.split(",")

    # Order from newest to oldest
    history.reverse()

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

    # Get specific review
    id = safe_cast(params, "id", int, -1)
    if id > 0:
        review = get_review(id, user.username)
        if review is None:
            return create_response(404, "Review not found")

        review = serialize_review([review])
        return create_response(200, body={"review": review})

    # Get all reviews
    page, limit = retrieve_page_and_limit(params)

    reviews = user.reviews.split(",")

    # Reverse the reviews
    reviews.reverse()

    paginated_reviews = retrieve_paginated_list(reviews, limit, page)

    if paginated_reviews == [""]:
        return create_response(200, body={"reviews": []})

    reviews: list[Review] = get_list_reviews(paginated_reviews, user.username)

    # Serialize the reviews
    reviews = serialize_review(reviews)

    return create_response(200, body={"reviews": reviews})


def create_review(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    # Check params
    params = get_body(event)
    id = safe_cast(params, "id", str, "")
    summary = safe_cast(params, "summary", str, "")
    rating = safe_cast(params, "rating", str, "")

    if id == "":
        return create_response(400, "Missing valid id")
    if summary == "":
        return create_response(400, "Missing summary")
    if rating == "":
        return create_response(400, "Missing rating")

    # Create a review
    movie = get_movie(id)

    if movie is None:
        return create_response(400, "Movie not found.")

    review_list = user.reviews.split(",")
    review_list.append(id)

    user.reviews = ",".join(ordered_set(review_list))

    # Remove comma if first element is empty
    if user.reviews[0] == ",":
        user.reviews = user.reviews[1:]

    user_result, user_message = update_user(user)

    if user_result is False:
        return create_response(500, user_message)

    result, message = create_user_review(movie, user.username, summary, int(rating))

    if result is False:
        return create_response(500, message)

    return create_response(200, "Successfully created review")


def update_review(event, context):
    pass


def delete_review(event, context, user: User):
    if user is None:
        # Shouldn't be reachable but just in case
        return create_response(404, "User not found")

    params = event["queryStringParameters"]

    id = safe_cast(params, "id", str, "")

    if id == "":
        return create_response(400, "Missing id")

    # Remove from user
    review = user.reviews.split(",")

    if id in review:
        review.remove(id)
    else:
        return create_response(400, "Movie does not have review")

    user.reviews = ",".join(ordered_set(review))

    # Remove comma if first element is empty
    if len(user.reviews) != 0:
        if user.reviews[0] == ",":
            user.reviews = user.reviews[1:]

    user_result, user_message = update_user(user)

    if user_result is False:
        return create_response(500, user_message)

    # Remove tie to movie
    result, message = remove_user_review(id, user.username)

    if result is False:
        return create_response(500, message)

    return create_response(200, message)
