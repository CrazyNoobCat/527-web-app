# Custom types for the back-end
from typing import List


class User:
    username: str
    email: str
    password: str

    def __init__(self, username: str, email: str, password: str) -> None:
        self.username = username
        self.email = email
        self.password = password


class Movie:
    id: str
    title: str
    release_date: int
    genre: str
    summary: str
    language: str
    budget: int
    revenue: int
    runtime: int

    def __init__(
        self,
        id: str,
        title: str,
        release_date: int,
        genre: str,
        summary: str,
        language: str,
        budget: int,
        revenue: int,
        runtime: int,
    ) -> None:
        self.id = id
        self.title = title
        self.release_date = release_date
        self.genre = genre
        self.summary = summary
        self.language = language
        self.budget = budget
        self.revenue = revenue
        self.runtime = runtime
