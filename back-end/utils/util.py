# Utility functions
import json
from .customTypes import Movie
from .dbHelper import get_movie


def get_body(event) -> dict:
    return json.loads(event["body"])


def create_response(
    status_code: int,
    message: str,
    header: dict[str, str] = None,
    body: dict[str, str] = None,
):
    """Create a response object"""
    if header is None:
        header = {}
    if body is None:
        body = {}

    body["message"] = message

    return {
        "statusCode": status_code,
        "headers": header,
        "body": json.dumps(body),
    }


def has_required_fields(body: dict, fields: list[str]) -> bool:
    """Check if the body has the required fields"""
    for field in fields:
        if body.get(field) is None:
            return False

    return True


def retrieve_paginated_list(list: list, limit: int, page: int) -> list:
    """Retrieve a paginated list"""
    start = limit * page

    if start >= len(list):
        return []

    end = min(limit * (page + 1), len(list))

    return list[start:end]


def get_list_movies(movie_ids: list[str]) -> list[Movie]:
    """Get a list of movies from a list of ids"""
    movies = []

    for movie_id in movie_ids:
        movie = get_movie(movie_id)
        if movie is not None:
            movies.append(movie)

    return movies
