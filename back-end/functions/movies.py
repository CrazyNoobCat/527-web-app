# Movie API functions
from utils.customTypes import Movie
from utils.dbHelper import (
    get_all_movie_reviews,
    get_movie as db_get_movie,
    search_movies,
)
from utils.util import create_response, safe_cast


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
    pass


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
