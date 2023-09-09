# Movie API functions
from utils.customTypes import Movie
from utils.dbHelper import (
    get_all_movie_reviews,
    get_movie as db_get_movie,
    search_movies,
    create_movie,
)
from utils.util import create_response, create_search_title, retrieve_page_and_limit, safe_cast, get_body


def get_movie(event, context):
    params = event["queryStringParameters"]

    # Setup defaults as all parameters are options
    id = safe_cast(params, "id", int, -1)

    genres = safe_cast(params, "genre", str, "")
    genres = genres.split(",")
    if genres == [""]:
        genres = []

    title = safe_cast(params, "title", str, "")
    year = safe_cast(params, "year", str, "")

    title = create_search_title(title)

    page, limit = retrieve_page_and_limit(params)

    movies: list[Movie] = []

    if id >= 0:
        movie = db_get_movie(id)
        if movie is not None:
            movies.append(db_get_movie(id))
    else:
        movies = search_movies(
            title=title,
            genre_names=genres,
            year=year,
            limit=limit,
            page=page,
        )

    # Serialize the movies
    movies = [movie.__dict__ for movie in movies]

    return create_response(200, body={"movies": movies})


def add_movie(event, context):
    body = get_body(event)

    title = safe_cast(body, "title", str, "")
    if title == "":
        return create_response(400, "Missing title")

    genre_names = safe_cast(body, "genre_names", str, "")
    if genre_names == "":
        return create_response(400, "Missing genre")

    summary = safe_cast(body, "summary", str, "")
    if summary == "":
        return create_response(400, "Missing movie summary")

    original_language = safe_cast(body, "original_language", str, "")
    if original_language == "":
        return create_response(400, "Missing original language")

    release_date = safe_cast(body, "release_date", str, "")
    if release_date == "":
        return create_response(400, "Missing release date")

    runtime = safe_cast(body, "runtime", int, 0)
    if runtime < 1:
        return create_response(400, "Missing runtime")

    budget = safe_cast(body, "budget", int, 0)
    if budget < 1:
        return create_response(400, "Missing budget")

    revenue = safe_cast(body, "revenue", int, 0)
    if revenue < 1:
        return create_response(400, "Missing revenue")

    result, message = create_movie(
        title,
        release_date,
        genre_names,
        summary,
        original_language,
        budget,
        revenue,
        runtime,
    )

    if result is False:
        return create_response(500, message)

    return create_response(200, message)


def get_movie_reviews(event, context):
    params = event["queryStringParameters"]

    id = safe_cast(params, "id", str, "")

    if id == "":
        return create_response(400, "Missing id")

    page, limit = retrieve_page_and_limit(params)

    reviews = get_all_movie_reviews(id, limit, page)

    if reviews is None:
        return create_response(404, "Movie or Reviews not found")

    # Serialize the reviews
    reviews = [review.__dict__ for review in reviews]

    return create_response(200, body={"reviews": reviews})
