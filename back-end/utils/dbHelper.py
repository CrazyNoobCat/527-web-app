# Handle accessing the DB
import boto3
import uuid6
from .customTypes import Movie, User
from passlib.hash import bcrypt
from .customTypes import Roles


# Connect to DB
dynamodb = boto3.resource("dynamodb")
userTable = dynamodb.Table("users")
movieTable = dynamodb.Table("movies")


def create_user(username: str, email: str, password: str):
    """Create a user in the DB, return True if successful else False"""

    try:
        # Check if username already exists
        result: dict = userTable.get_item(Key={"username": username})

        user: dict = result.get("Item")

        if user is not None:
            return (False, "Username already exists")

        # Check password length
        # TODO: add more password requirements?
        if len(password) < 8:
            return (False, "Password must be at least 8 characters")

        # TODO: add email validation

        # Hash password
        hashed_password = bcrypt.hash(password)

        # Create user in DB
        result = userTable.put_item(
            Item={
                "username": username,
                "email": email,
                "password": hashed_password,
                "role": str(Roles.USER),
            }
        )
        # TODO: log creation

        return (True, "User created successfully")
    except Exception as e:
        # TODO: log error
        print("Error creating user:", e)
        return (False, "Error creating user")


def find_user(username: str, password: str) -> User | None:
    """Find a user in the DB, return User object if found else None"""
    # Query for username
    result: dict = userTable.get_item(Key={"username": username})

    user: dict = result.get("Item")

    if user is None:
        return None

    # If username found, check password bcrypt matches
    if bcrypt.verify(password, user.get("password")):
        return User(
            username=user.get("username"),
            email=user.get("email"),
            password=user.get("password"),
            role=user.get("role"),
        )

    return None


def get_user_by_username(username) -> User | None:
    """Get a user by username, return User object if found else None"""
    # Query for username
    result: dict = userTable.get_item(Key={"username": username})
    user: dict = result.get("Item")

    if user is None:
        return None

    # If username found, return user object
    if user is not None:
        return User(
            username=user.get("username"),
            email=user.get("email"),
            password=user.get("password"),
            role=user.get("role"),
        )

    return None


def get_movie_by_uuid(uuid: int) -> Movie | None:
    """Get a movie by id, return Movie object if found else None"""
    # Query for id
    result: dict = movieTable.get_item(Key={"movieId": id})
    movie: dict = result.get("Item")

    if movie is None:
        return None

    # If id found, return movie object
    if movie is not None:
        return Movie(
            uuid=movie.get("uuid"),
            title=movie.get("title"),
            year=movie.get("year"),
            director=movie.get("director"),
            genre=movie.get("genre"),
            summary=movie.get("summary"),
        )

    return None


def search_movies(
    title: str = "",
    year: int = "",
    director: str = "",
    genre: str = "",
    batch_size: int = 50,
    page_index: int = 0,
) -> list[Movie]:
    """Search for movies based on title, year, director, and genre"""

    # Calculate the number of items to skip
    items_to_skip = page_index * batch_size

    # Initialize variables for tracking the number of items skipped and the last evaluated key
    skipped_items = 0
    last_evaluated_key = None

    # Keep querying until we have skipped enough items or there are no more items to query
    while skipped_items < items_to_skip:
        # Query for a batch of movies
        response = movieTable.query(
            Select="ALL_ATTRIBUTES",
            ExclusiveStartKey=last_evaluated_key,
            Limit=batch_size,
        )

        # Update the number of items skipped and the last evaluated key
        skipped_items += response["Count"]
        last_evaluated_key = response.get("LastEvaluatedKey")

        # Check if there are no more items to query
        if last_evaluated_key is None:
            break

    # Query for the next batch of movies
    response = movieTable.query(
        Select="ALL_ATTRIBUTES", ExclusiveStartKey=last_evaluated_key, Limit=batch_size
    )

    # Create a list of movies
    movies = list[Movie]

    for item in response["Items"]:
        movies.append(
            Movie(
                uuid=item.get("uuid"),
                title=item.get("title"),
                year=item.get("year"),
                director=item.get("director"),
                genre=item.get("genre"),
                summary=item.get("summary"),
            )
        )

    return movies


def create_movie(
    title: str,
    year: int,
    director: str,
    genre: str,
    summary: str,
) -> bool:
    """Create a movie in the DB, return True if successful else False"""

    try:
        # Check movie doesn't already exist
        movies = search_movies(title=title, year=year, director=director, genre=genre)

        # TODO: this movies list could actually have a partial match, e.g. same director, genre, year but the title for the movie we are making is part of another title
        if len(movies) > 0:
            return False
        
        # Generate a uuid for the movie
        uuid = uuid6.uuid7()

        # Create movie in DB 
        result = movieTable.put_item(
            Item={
                "uuid": uuid,
                "title": title,
                "year": year,
                "director": director,
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
