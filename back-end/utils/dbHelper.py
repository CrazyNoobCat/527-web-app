# Handle accessing the DB
import boto3
from .customTypes import Movie, Review, User
from passlib.hash import bcrypt
from boto3.dynamodb.conditions import Key, Attr

import traceback


# User Table
USER_PARTITION_KEY = "user"

# Movie Table
MOVIE_PARTITION_KEY = "movie"
REVIEW_PARTITION_KEY = "review"

# Connect to DB
dynamodb = boto3.resource("dynamodb")
userTable = dynamodb.Table("users")
movieTable = dynamodb.Table("movies")


def create_user(username: str, email: str, password: str):
    """Create a user in the DB, return True if successful else False"""

    try:
        # Check if username already exists
        result: dict = userTable.get_item(
            Key={
                "pt_key": USER_PARTITION_KEY,  # Only searching for the user partition
                "username": username,
            }
        )

        user: dict = result.get("Item")

        if user is not None:
            return (False, "Username already exists")

        # Check password length
        # TODO: add more password requirements?
        if len(password) < 8:
            return (False, "Password must be at least 8 characters")

        # Hash password
        hashed_password = bcrypt.hash(password)

        new_user = {
            "pt_key": USER_PARTITION_KEY,
            "username": username,
            "email": email,
            "password": hashed_password,
            "reviews": "",
            "watch_list": "",
            "watch_history": "",
        }

        # Create user in DB
        result = userTable.put_item(Item=new_user)

        print("create_user: new_user: ", new_user)

        return (True, "User created successfully")
    except Exception as e:
        print("create_user: Error:", e)
        return (False, "Error creating user")


def update_user(user: User):
    """Update a user in the DB, return True if successful else False also a message to return to the user"""
    try:
        # Check if username already exists
        result: dict = userTable.get_item(
            Key={
                "pt_key": USER_PARTITION_KEY,  # Only searching for the user partition
                "username": user.username,
            }
        )

        originalUser: dict = result.get("Item")

        if originalUser is None:
            return (False, "User does not exist")

        # TODO: optimising by only updating the fields that have changed

        # Update user in DB
        result = userTable.update_item(
            Key={"username": user.username},
            UpdateExpression="set email=:e, reviews=:r, watch_list=:w, watch_history=:h",
            ExpressionAttributeValues={
                ":e": user.email,
                ":r": user.reviews,
                ":w": user.watch_list,
                ":h": user.watch_history,
            },
            ReturnValues="UPDATED_NEW",
        )

        print("update_user: user: ", user)

        return (True, "User updated successfully")
    except Exception as e:
        print("update_user: Error:", e)
        return (False, "Error updating user")


def authenticate_user(username: str, password: str) -> User | None:
    """Find a user in the DB, return User object if found else None"""
    try:
        # Query for username
        result: dict = userTable.get_item(
            Key={
                "pt_key": USER_PARTITION_KEY,  # Only searching for the user partition
                "username": username,
            }
        )

        user: dict = result.get("Item")

        if user is None:
            return None

        # If username found, check password bcrypt matches
        if bcrypt.verify(password, user.get("password")):
            return User(username=user.get("username"), email=user.get("email"))

        return None
    except Exception as e:
        print("authenticate_user: Error:", e)
        return None


def get_user(username) -> User | None:
    """Get a user by username, return User object if found else None"""
    try:
        if username is None:
            return None

        # Query for username
        result: dict = userTable.get_item(
            Key={
                "pt_key": USER_PARTITION_KEY,  # Only searching for the user partition
                "username": username,
            }
        )
        user: dict = result.get("Item")

        if user is None:
            return None

        # If username found, return user object
        if user is not None:
            return User(
                username=user.get("username"),
                email=user.get("email"),
                reviews=user.get("reviews"),
                watch_list=user.get("watch_list"),
                watch_history=user.get("watch_history"),
            )

        return None
    except Exception as e:
        print("get_user: Error: ", e)
        return None


def get_movie(id: int) -> Movie | None:
    """Get a movie by id, return Movie object if found else None"""
    try:
        if id is None:
            return None

        key = {
            "pt_key": MOVIE_PARTITION_KEY,  # Only searching for the movie partition
            "id": id,
        }

        result: dict = movieTable.get_item(Key=key)
        movie: dict = result.get("Item")

        # If id found, return movie object
        if movie is not None:
            return Movie(
                id=str(movie.get("id")),
                title=movie.get("title"),
                release_date=str(movie.get("release_date")),
                genre=movie.get("genre_names"),
                summary=movie.get("summary"),
                language=movie.get("original_language"),
                budget=str(movie.get("budget")),
                revenue=str(movie.get("revenue")),
                runtime=str(movie.get("runtime")),
            )

        return movie

    except Exception as e:
        print("get_movie: Error: ", e)
        return None


def search_movies(
    title: str = "",
    genre_names: list[str] = [],
    year: str = "",
    limit: int = 50,
    page_index: int = 1,
) -> list[Movie]:
    """Search for movies based on title, genre_names, director, and genre"""

    try:
        client = boto3.client("dynamodb")
        paginator = client.get_paginator("query")
        response_iterator = None

        # current_page = 0
        # last_evaluated_key = None

        key_condition_expression = "pt_key = :partition_key_value"

        # Define the filter expression as a string
        filter_expression = "contains(title, :title) AND contains(release_date, :year)"

        # Define the expression attribute values
        expression_attribute_values = {
            ":title": {"S": title},
            ":year": {"S": year},
            ":partition_key_value": {"S": MOVIE_PARTITION_KEY},
        }

        # Do the same for genres
        if genre_names is not []:
            genre_filter = ""
            for genre in genre_names:
                print("search_movies: genre: ", genre)
                count += 1
                if genre_filter == "":
                    genre_filter = f"contains(genre_names, :g{count})"
                else:
                    genre_filter = (
                        genre_filter + f" OR contains(genre_names, :g{count})"
                    )

                expression_attribute_values[f":g{count}"] = {"S": genre}

            if genre_filter != "":
                filter_expression = (
                    "(" + filter_expression + ") AND (" + genre_filter + ")"
                )

        print("search_movies: filter_expression: ", filter_expression)
        print(
            "search_movies: expression_attribute_values: ", expression_attribute_values
        )

        # filter_expression = Attr("title").contains(title) & Attr("release_date").contains(year)

        # genre filter expression
        # if genre_names is not []:
        #     genre_filter = None
        #     for genre in genre_names:
        #         print("search_movies: genre: ", genre)
        #         if genre_filter is None:
        #             genre_filter = Attr("genre_names").contains(genre)
        #         else:
        #             genre_filter = genre_filter | Attr("genre_names").contains(genre)

        #     if genre_filter is not None:
        #         filter_expression = filter_expression & genre_filter

        # Get first page of results

        rawMovies = []

        # Keep querying until we have skipped enough items or there are no more items to query
        for _ in range(page_index):
            response_iterator = paginator.paginate(
                TableName="movies",
                # KeyConditionExpression=Key("pt_key").eq(MOVIE_PARTITION_KEY),
                KeyConditionExpression=key_condition_expression,
                FilterExpression=filter_expression,
                ExpressionAttributeValues=expression_attribute_values,
                Select="ALL_ATTRIBUTES",
                PaginationConfig={
                    "MaxItems": limit * page_index,
                    "PageSize": limit,
                    "StartingToken": None,
                },
            )

        rawMovies = response_iterator.build_full_result().get("Items")

        # Retrieve specific page
        # for page in response_iterator:
        #     print("Items : ", page["Items"])
        #     # if page["Count"] >= limit * page_index or len(page["Items"]) == 0:
        #     #     rawMovies = page["Items"]
        #     #     break

        if len(rawMovies) == 0:
            return []

        # _, last_evaluated_key = filter_scan_movies(
        #     filter_expression,
        #     max_results=limit,
        #     last_evaluated_key=last_evaluated_key,
        #     partition_key=MOVIE_PARTITION_KEY,
        # )

        # If there are no more items to query, return an empty list

        # rawMovies, last_evaluated_key = filter_scan_movies(
        #     filter_expression,
        #     max_results=limit,
        #     last_evaluated_key=last_evaluated_key,
        #     partition_key=MOVIE_PARTITION_KEY,
        # )

        movies: list[Movie] = []

        for movie in rawMovies:
            movies.append(
                Movie(
                    id=str(movie.get("id")),
                    title=movie.get("title"),
                    release_date=str(movie.get("release_date")),
                    genre=movie.get("genre_names"),
                    summary=movie.get("summary"),
                    language=movie.get("original_language"),
                    budget=str(movie.get("budget")),
                    revenue=str(movie.get("revenue")),
                    runtime=str(movie.get("runtime")),
                )
            )

        return movies
    except Exception as e:
        print("search_movies: Error: ", e)
        traceback.print_exc()

        return []


def filter_scan_movies(
    filter_expression,
    max_results,
    batch_size=100,
    last_evaluated_key=None,
    partition_key=MOVIE_PARTITION_KEY,
):
    """
    Scan the movies table with a filter expression, return the results and the last evaluated key
    :param partition_key the partition key to search for on the movie table
    """
    results = []

    try:
        while len(results) < max_results:
            response = None

            if last_evaluated_key is None:
                response = movieTable.query(
                    KeyConditionExpression=Key("pt_key").eq(partition_key),
                    FilterExpression=filter_expression,
                    Select="ALL_ATTRIBUTES",
                    Limit=batch_size,
                )

            else:
                response = movieTable.query(
                    KeyConditionExpression=Key("pt_key").eq(partition_key),
                    FilterExpression=filter_expression,
                    Select="ALL_ATTRIBUTES",
                    ExclusiveStartKey=last_evaluated_key,
                    Limit=batch_size,
                )

            results.extend(response["Items"])

            # Limit results to max_results
            if len(results) >= max_results:
                results = results[:max_results]
                last_evaluated_key = results[-1]  # Was trying to do something here
                break

            last_evaluated_key = response.get("LastEvaluatedKey")

            # Check if there are no more items to query
            if last_evaluated_key is None:
                break

        return (results, last_evaluated_key)

    except Exception as e:
        print("filter_scan_movies: Error:", e)
        return (results, last_evaluated_key)


# TODO: CHANGE THE VARIABLES
def create_movie(
    title: str,
    release_date: int,
    genre: str,
    summary: str,
    language: str,
    budget: int,
    revenue: int,
    runtime: int,
) -> bool:
    """Create a movie in the DB, return True if successful else False"""

    try:
        # Check movie doesn't already exist
        movies = search_movies(title=title, year=year, director=director, genre=genre)

        # TODO: this movies list could actually have a partial match, e.g. same director, genre, year but the title for the movie we are making is part of another title
        if len(movies) > 0:
            return False

        # Retrieve the next id
        response = movieTable.query(ScanIndexForward=False, Limit=1)

        last_item = response["Items"][0]

        id = int(last_item["id"]) + 1

        # Create movie in DB
        movieTable.put_item(
            Item={
                "id": id,
                "title": title,
                "genre": genre,
                "summary": summary,
            }
        )

        return True

    except Exception as e:
        print("Error creating movie:", e)
        return False


# Create a movie

# Update a movie


def get_review(id, username) -> Review | None:
    try:
        movie = get_movie(id)

        if movie is None:
            return None

        result = movieTable.get_item(
            Key={
                "pt_key": REVIEW_PARTITION_KEY,  # Only searching for the review partition
                "id": id,
                "username": username,
            }
        )

        review = result.get("Item")

        if review is None:
            return None

        return Review(
            movie=movie,
            username=review.get("username"),
            summary=review.get("summary"),
            rating=review.get("rating"),
        )

    except Exception as e:
        print("get_review: Error:", e)
        return None


def get_all_movie_reviews(id, limit: int = 50, page_index: int = 0) -> list[Review]:
    try:
        current_page = 0

        filter_expression = str(Key("id").eq(id))

        while current_page < page_index:
            _, last_evaluated_key = filter_scan_movies(
                filter_expression,
                max_results=limit,
                last_evaluated_key=last_evaluated_key,
                partition_key=REVIEW_PARTITION_KEY,
            )

            current_page += 1

            print("get_all_movie_reviews: Current page: " + str(current_page))

            # If there are no more items to query, return an empty list
            if last_evaluated_key is None:
                print("get_all_movie_reviews: no more reviews to query")
                return []

        rawReviews, last_evaluated_key = filter_scan_movies(
            filter_expression,
            max_results=limit,
            last_evaluated_key=last_evaluated_key,
            partition_key=REVIEW_PARTITION_KEY,
        )

        reviews: list[Movie] = []

        for review in rawReviews:
            reviews.append(
                Review(
                    movie="",
                    username=review.get("username"),
                    summary=review.get("summary"),
                    rating=review.get("rating"),
                )
            )

        return reviews

    except Exception as e:
        print("get_all_movie_reviews: Error:", e)
        return None
