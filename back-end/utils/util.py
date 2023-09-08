# Utility functions
import json
from .customTypes import Movie, Review
from .dbHelper import get_movie, get_review


def get_body(event) -> dict:
    return json.loads(event["body"])


def create_response(
    status_code: int,
    message: str = "",
    header: dict[str, str] = {"Content-Type": "application/json"},
    body: dict[str, str] = None,
):
    """Create a response object"""
    if body is None:
        body = {}

    if header is None:
        header = {"Content-Type": "application/json"}

    if message != "":
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


def get_list_reviews(review_ids: list[str], username) -> list[Review]:
    """Get a list of reviews from a list of ids"""
    reviews = []

    for review_id in review_ids:
        review = get_review(review_id, username)
        if review is not None:
            reviews.append(review)

    return reviews


def safe_cast(val, to_type, default=None):
    try:
        return to_type(val)
    except (ValueError, TypeError):
        return default
