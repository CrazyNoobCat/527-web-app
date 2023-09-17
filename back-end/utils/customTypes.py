# Custom types for the back-end
from typing import List


class User:
    username: str
    email: str
    password: str  # hashed passwod
    reviews: str  # comma seperated list of movie ids
    watch_list: str  # comma seperated list of movie ids
    watch_history: str  # comma seperated list of movie ids

    def __init__(
        self,
        username: str = "",
        email: str = "",
        password: str = "",
        reviews: str = "",
        watch_list: str = "",
        watch_history: str = "",
    ) -> None:
        self.username = username
        self.email = email
        self.password = password
        self.reviews = reviews
        self.watch_list = watch_list
        self.watch_history = watch_history


class Movie:
    id: str
    title: str
    release_date: str
    genre: str  # comma seperated list of genres
    summary: str
    language: str
    budget: str
    revenue: str
    runtime: str

    def __init__(
        self,
        id: str = "",
        title: str = "",
        release_date: str = "",
        genre: str = "",
        summary: str = "",
        language: str = "",
        budget: str = "",
        revenue: str = "",
        runtime: str = "",
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


class Review:
    movie: Movie
    username: str
    summary: str
    rating: int
    date: str

    def __init__(
        self,
        movie: Movie = "",
        username: str = "",
        summary: str = "",
        rating: int = "",
        date: str = "",
    ) -> None:
        self.movie = movie
        self.username = username
        self.summary = summary
        self.rating = rating
        self.date = date
