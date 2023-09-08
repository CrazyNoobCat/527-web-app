# Handle accessing the DB
from decimal import Decimal
import boto3
from .customTypes import Movie, Review, User
from passlib.hash import bcrypt
from boto3.dynamodb.conditions import Key, Attr

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
    page: int = 1,
) -> list[Movie]:
    """Search for movies based on title, genre_names, director, and genre"""
    try:
        filter_expression = Attr("title").contains(title) & Attr(
            "release_date"
        ).contains(year)

        # genre filter expression
        if genre_names is not []:
            genre_filter = None
            for genre in genre_names:
                if genre_filter is None:
                    genre_filter = Attr("genre_names").contains(genre)
                else:
                    genre_filter = genre_filter | Attr("genre_names").contains(genre)

            if genre_filter is not None:
                filter_expression = filter_expression & (genre_filter)

        rawMovies = query_page_movies(
            filter_expression=filter_expression, max_results=limit, page=page
        )

        if len(rawMovies) == 0:
            return []

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
        return []


def query_page_movies(
    filter_expression,
    max_results,
    page=1,
    partition_key=MOVIE_PARTITION_KEY,
) -> list[Movie]:
    """
    Scan the movies table with a filter expression, return the results and the last evaluated key
    :param partition_key the partition key to search for on the movie table
    """
    results = []
    last_evaluated_key = None

    batch_size = max(500, max_results)

    try:
        for cp in range(page):  # Query till current page count
            results = []
            while len(results) < max_results:  # Ensure we have enough results per page
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

                if len(results) >= max_results:
                    results = results[:max_results]
                    # TODO: Perform some fancy logic to prevent needless queries if enough data exists
                    last_evaluated_key = {
                        "id": Decimal(results[max_results - 1]["id"]),
                        "pt_key": partition_key,
                    }
                    break
                else:
                    last_evaluated_key = response.get("LastEvaluatedKey")

                # Check if there are no more items to query
                if last_evaluated_key is None:
                    if cp + 1 != page:
                        return []

                    return results

        return results

    except Exception as e:
        print("filter_scan_movies: Error:", e)
        return results


# TODO: CHANGE THE VARIABLES
def create_movie(
    title: str,
    release_date: str,
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
        year = release_date.split("/")[-1]
        movies = search_movies(title=title, year=year, genre=genre, limit=1, page=1)

        # Movie found cannot add duplicate
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
                "release_date": release_date,
                "original_language": language,
                "budget": budget,
                "revenue": revenue,
                "runtime": runtime,
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


def get_all_movie_reviews(id, limit: int = 50, page: int = 1) -> list[Review]:
    try:
        filter_expression = str(Key("id").eq(id))

        rawReviews = query_page_movies(
            filter_expression,
            max_results=limit,
            page=page,
            partition_key=REVIEW_PARTITION_KEY,
        )

        if len(rawReviews) == 0:
            return []

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
