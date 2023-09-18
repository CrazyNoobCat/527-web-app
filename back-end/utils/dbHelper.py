# Handle accessing the DB
from datetime import date
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
reviewTable = dynamodb.Table("reviews")


def create_user(username: str, email: str, password: str):
    """Create a user in the DB, return True if successful else False"""

    try:
        # Ensure username doesn't have spaces
        if " " in username:
            return (False, "Username cannot contain spaces")

        # Ensure username is not empty
        if username == "":
            return (False, "Username cannot be empty")

        # Check if username already exists
        result: dict = userTable.get_item(
            Key={
                "pt_key": USER_PARTITION_KEY,  # Only searching for the user partition
                "username_lower": username.lower(),
            }
        )

        user: dict = result.get("Item")

        if user is not None:
            return (False, "Username already exists")

        # Check password length
        if len(password) < 8:
            return (False, "Password must be at least 8 characters")

        # Check email is valid
        if "@" not in email:
            return (False, "Email is not valid")

        # Hash password
        hashed_password = bcrypt.hash(password)

        new_user = {
            "pt_key": USER_PARTITION_KEY,
            "username": username,
            "username_lower": username.lower(),
            "email": email.lower(),
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
        key = {
            "pt_key": USER_PARTITION_KEY,  # Only searching for the user partition
            "username_lower": user.username.lower(),
        }
        # Check if username already exists
        result: dict = userTable.get_item(Key=key)

        originalUser: dict = result.get("Item")

        if originalUser is None:
            return (False, "User does not exist")

        # Only update the fields that have changed
        update_expression = "set "
        expression_attribute_values = {}

        if user.email != str(originalUser.get("email")):
            if "@" not in user.email:
                return (False, "Email is not valid")
            update_expression += "email=:e, "
            expression_attribute_values[":e"] = user.email.lower()

        if user.reviews != str(originalUser.get("reviews")):
            update_expression += "reviews=:r, "
            expression_attribute_values[":r"] = user.reviews

        if user.watch_list != str(originalUser.get("watch_list")):
            update_expression += "watch_list=:w, "
            expression_attribute_values[":w"] = user.watch_list

        if user.watch_history != str(originalUser.get("watch_history")):
            update_expression += "watch_history=:h, "
            expression_attribute_values[":h"] = user.watch_history

        if user.password != str(originalUser.get("password")):
            if len(user.password) < 8:
                return (False, "Password must be at least 8 characters")
            update_expression += "password=:p, "
            expression_attribute_values[
                ":p"
            ] = user.password  # We assume the password is already hashed

        if update_expression == "set ":
            return (True, "Nothing to update")

        update_expression = update_expression[:-2]  # Remove the last comma and space

        # Update user in DB
        result = userTable.update_item(
            Key=key,
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_attribute_values,
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
                "username_lower": username.lower(),
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


def get_user(username: str) -> User | None:
    """Get a user by username, return User object if found else None"""
    try:
        if username is None:
            return None

        # Query for username
        result: dict = userTable.get_item(
            Key={
                "pt_key": USER_PARTITION_KEY,  # Only searching for the user partition
                "username_lower": username.lower(),
            }
        )
        user: dict = result.get("Item")

        if user is None:
            return None

        # If username found, return user object
        if user is not None:
            return User(
                username=user.get("username"),
                password=user.get("password"),
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
            "id": Decimal(id),
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
        filter_expression = Attr("search_title").contains(title) & Attr(
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

        rawMovies = query_page(
            table=movieTable,
            filter_expression=filter_expression,
            max_results=limit,
            page=page,
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


def query_page(
    table=movieTable,
    filter_expression=None,
    max_results=50,
    page=1,
    key_expression=None,
    partition_key=MOVIE_PARTITION_KEY,
    scan_forwards=True,
) -> list[Movie]:
    """
    Scan the movies table with a filter expression, return the results and the last evaluated key
    :param partition_key the partition key to search for on the movie table
    """
    results = []
    last_evaluated_key = None

    batch_size = max(500, max_results)
    cp = 0

    if key_expression is None:
        key_expression = Key("pt_key").eq(partition_key)

    try:
        while cp < page:  # Query till current page count
            results = []
            temp = []
            while len(results) < max_results:  # Ensure we have enough results per page
                response = None

                if last_evaluated_key is None and filter_expression is None:
                    response = table.query(
                        KeyConditionExpression=key_expression,
                        Select="ALL_ATTRIBUTES",
                        Limit=batch_size,
                        ScanIndexForward=scan_forwards,
                    )
                elif last_evaluated_key is None and filter_expression is not None:
                    response = table.query(
                        KeyConditionExpression=key_expression,
                        FilterExpression=filter_expression,
                        Select="ALL_ATTRIBUTES",
                        Limit=batch_size,
                        ScanIndexForward=scan_forwards,
                    )

                elif filter_expression is not None:
                    response = table.query(
                        KeyConditionExpression=key_expression,
                        FilterExpression=filter_expression,
                        Select="ALL_ATTRIBUTES",
                        ExclusiveStartKey=last_evaluated_key,
                        Limit=batch_size,
                        ScanIndexForward=scan_forwards,
                    )
                else:
                    response = table.query(
                        KeyConditionExpression=key_expression,
                        Select="ALL_ATTRIBUTES",
                        ExclusiveStartKey=last_evaluated_key,
                        Limit=batch_size,
                        ScanIndexForward=scan_forwards,
                    )

                results.extend(response["Items"])
                temp = results

                # Perform some smart logic to itterate through retrieved data to reduce DB calls
                while len(temp) >= max_results:
                    results = temp[:max_results]
                    temp = temp[max_results:]

                    cp += 1

                    if cp == page:
                        break

                    if table == movieTable:
                        last_evaluated_key = {
                            "id": Decimal(results[max_results - 1]["id"]),
                            "pt_key": partition_key,
                        }
                    elif table == reviewTable:
                        last_evaluated_key = {
                            "movie_id": Decimal(results[max_results - 1]["movie_id"]),
                            "username": results[max_results - 1]["username"],
                        }
                    elif table == userTable:
                        last_evaluated_key = {
                            "username_lower": results[max_results - 1][
                                "username_lower"
                            ],
                            "pt_key": partition_key,
                        }

                if len(results) == max_results:
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
        print("query_page: Error:", e)
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
    from .util import create_search_title

    try:
        # Check movie doesn't already exist
        year = release_date.split("/")[-1]
        movies = search_movies(
            title=title, year=year, genre_names=genre, limit=1, page=1
        )

        # Movie found cannot add duplicate
        if len(movies) > 0:
            return (False, "Movie Exists in database")

        # Retrieve the next id
        response = movieTable.query(
            KeyConditionExpression=Key("pt_key").eq(MOVIE_PARTITION_KEY),
            ScanIndexForward=False,
            Limit=1,
        )

        last_item = response["Items"][0]

        id = int(last_item["id"]) + 1

        # Create movie in DB
        movieTable.put_item(
            Item={
                "pt_key": MOVIE_PARTITION_KEY,
                "id": Decimal(id),
                "title": title,
                "genre": genre,
                "summary": summary,
                "release_date": release_date,
                "original_language": language,
                "budget": budget,
                "revenue": revenue,
                "runtime": runtime,
                "search_title": create_search_title(title),
            }
        )

        return (True, "Movie created successfully")

    except Exception as e:
        print("Error creating movie:", e)
        return (False, "Error creating movie")


def get_review(id, username) -> Review | None:
    try:
        movie = get_movie(id)

        if movie is None:
            return None

        key_expression = Key("movie_id").eq(Decimal(id)) & Key("username").eq(username)

        result = query_page(
            table=reviewTable,
            max_results=1,
            page=1,
            key_expression=key_expression,
        )

        if len(result) == 0:
            return None

        review = result[0]

        return Review(
            movie=movie,
            username=review.get("username"),
            summary=review.get("summary"),
            rating=str(review.get("rating")),
            date=review.get("date"),
        )

    except Exception as e:
        print("get_review: Error:", e)
        return None


def get_all_movie_reviews(id, limit: int = 50, page: int = 1) -> list[Review]:
    try:
        key_expression = Key("movie_id").eq(Decimal(id))

        # Ensure to retrieve reviews from oldest to newest
        rawReviews = query_page(
            table=reviewTable,
            key_expression=key_expression,
            max_results=limit,
            page=page,
            scan_forwards=True,
        )

        if len(rawReviews) == 0:
            return []

        reviews: list[Review] = []

        for review in rawReviews:
            reviews.append(
                Review(
                    movie="",
                    username=review.get("username"),
                    summary=review.get("summary"),
                    rating=str(review.get("rating")),
                    date=review.get("date"),
                )
            )

        return reviews

    except Exception as e:
        print("get_all_movie_reviews: Error:", e)
        return None


def create_user_review(
    movie: Movie,
    username: str,
    summary: str,
    rating: int,
) -> bool:
    try:
        id = Decimal(movie.id)

        key_expression = Key("movie_id").eq(id) & Key("username").eq(username)

        result = query_page(
            table=reviewTable,
            max_results=1,
            page=1,
            key_expression=key_expression,
        )

        if len(result) != 0:
            return (False, "Review for movie already exists.")

        reviewTable.put_item(
            Item={
                "movie_id": id,
                "username": username,
                "summary": summary,
                "rating": rating,
                "date": date.today().strftime("%d/%m/%Y"),
            }
        )

        return (True, "Review created successfully.")

    except Exception as e:
        print("Error creating review:", e)
        return (False, "Error creating review")


def remove_user_review(
    id: int,
    username: str,
) -> bool:
    try:
        # Find movie by id and username query
        id = Decimal(id)
        key_expression = Key("movie_id").eq(id) & Key("username").eq(username)

        result = query_page(
            table=reviewTable,
            max_results=1,
            page=1,
            key_expression=key_expression,
        )

        if len(result) == 0:
            return (False, "Review for movie does not exist.")

        reviewTable.delete_item(
            Key={
                "movie_id": id,
                "username": username,
            }
        )

        return (True, "Review removed successfully.")

    except Exception as e:
        print("Error removing review:", e)
        return (False, "Error removing review")
