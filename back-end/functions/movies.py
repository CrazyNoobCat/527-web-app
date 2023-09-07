# Movie API functions
from utils.dbHelper import get_all_movie_reviews, get_movie, search_movies
from utils.util import create_response


def get_movie(event, context):
    params = event["queryStringParameters"]

    # Setup defaults as all parameters are options
    id = params["id"] if params["id"] is not None else ""
    genres = params["genre"].split(",") if params["genre"] is not None else []
    title = params["title"] if params["title"] is not None else ""
    year = params["year"] if params["year"] is not None else ""
    limit = params["limit"] if params["limit"] is not None else 50
    page = params["page"] if params["page"] is not None else 0

    movie: movie = None

    if id != "":
        movie = get_movie(id)
    else:
        movie = search_movies(
            title=title,
            genre_names=genres,
            year=year,
            limit=limit,
            page=page,
        )

    if movie is None:
        return create_response(404, "Movie not found")

    return create_response(200, body=movie)


def add_movie(event, context):
    pass


def get_movie_reviews(event, context):
    params = event["queryStringParameters"]

    id = params["id"] if params["id"] else ""

    if id == "":
        return create_response(400, "Missing id")

    limit = params["limit"] if params["limit"] else 50
    page = params["page"] if params["page"] else 0

    reviews = get_all_movie_reviews(id, limit, page)

    if reviews is None:
        return create_response(404, "Movie or Reviews not found")

    return create_response(200, body={"reviews": reviews})
