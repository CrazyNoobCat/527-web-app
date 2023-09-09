# Movie API functions
from utils.customTypes import Movie
from utils.dbHelper import (
    get_all_movie_reviews,
    get_movie as db_get_movie,
    search_movies,
    create_movie,
)
from utils.util import create_response, safe_cast, get_body


def get_movie(event, context):
    params = event["queryStringParameters"]

    # Setup defaults as all parameters are options
    id = safe_cast(params["id"], int, -1)
    genres = params["genre"].split(",") if params["genre"] is not None else []
    if genres == [""]:
        genres = []

    title = params["title"] if params["title"] is not None else ""
    year = params["year"] if params["year"] is not None else ""
    limit = safe_cast(params["limit"], int, 50)
    page = safe_cast(params["page"], int, 1)

    if page < 0 or limit < 0:
        return create_response(400, "Invalid page or limit")

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

    if body is None:
        return create_response(400, "Missing body")

    if body["title"] is None or body["title"] == "":
        return create_response(400, "Missing title")

    if body["genre_names"] is None or body["genre_names"] == "":
        return create_response(400, "Missing genre")

    if body["summary"] is None or body["summary"] == "":
        return create_response(400, "Missing movie summary")

    if body["runtime"] is None or body["runtime"] == "":
        return create_response(400, "Missing runtime")

    ## Anything below may be considered non-essential, so no need for them to be checked?
    # TODO Make design decision on what is required, non requried turn to "" if empty.
    if body["original_language"] is None or body["original_language"] == "":
        return create_response(400, "Missing original language")

    if body["release_date"] is None or body["release_date"] == "":
        return create_response(400, "Missing release date")

    if body["budget"] is None or body["budget"] == "":
        return create_response(400, "Missing budget")

    if body["revenue"] is None or body["revenue"] == "":
        return create_response(400, "Missing revenue")

    result, message = create_movie(
        body["title"],
        body["release_date"],
        body["genre_names"],
        body["summary"],
        body["original_language"],
        int(body["budget"]),
        int(body["revenue"]),
        int(body["runtime"]),
    )

    if result is False:
        return create_response(500, message)

    return create_response(200, message)


def get_movie_reviews(event, context):
    params = event["queryStringParameters"]

    id = params["id"] if params["id"] else ""

    if id == "":
        return create_response(400, "Missing id")

    limit = safe_cast(params["limit"], int, 50)
    page = safe_cast(params["page"], int, 1)

    reviews = get_all_movie_reviews(id, limit, page)

    if reviews is None:
        return create_response(404, "Movie or Reviews not found")

    return create_response(200, body={"reviews": reviews})
