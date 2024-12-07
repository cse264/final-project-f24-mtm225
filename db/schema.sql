CREATE DATABASE instadex;
\c instadex

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE pokemon_info (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    pokemon_name VARCHAR(50) NOT NULL,
    info TEXT NOT NULL
);