# Custom types for the back-end
from enum import Enum
from typing import List

Roles = Enum("Roles", ["ADMIN", "USER", "AWAITING_EMAIL_VERIFICATION"])


class User:
    username: str
    email: str
    password: str
    role: Roles

    def __init__(self, username: str, email: str, password: str, role: Roles) -> None:
        self.username = username
        self.email = email
        self.password = password
        self.role = role


class Movie:
    movieID: str
    title: str
    year: int
    director: str
    genre: List[str]
    plot: str

    def __init__(
        self,
        movieID: str,
        title: str,
        year: int,
        director: str,
        genre: List[str],
        plot: str,
    ) -> None:
        self.movieID = movieID
        self.title = title
        self.year = year
        self.director = director
        self.genre = genre
        self.plot = plot
