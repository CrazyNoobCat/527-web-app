# Handle accessing the DB
import boto3
from .customTypes import User
from passlib.hash import bcrypt
from .customTypes import Roles


# Connect to DB
dynamodb = boto3.resource("dynamodb")
userTable = dynamodb.Table("users")


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


# Create a movie

# Update a movie
