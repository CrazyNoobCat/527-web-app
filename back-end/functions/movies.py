# Movie API functions
from utils.dbHelper import get_movie_by_id, search_movies
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
        movie = get_movie_by_id(id)
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


def get_reviews(event, context):
    pass
