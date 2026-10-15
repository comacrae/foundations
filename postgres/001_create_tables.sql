CREATE TABLE IF NOT EXISTS authors (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    birth_date date NULL
);

CREATE TABLE IF NOT EXISTS books (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id integer NOT NULL REFERENCES authors (id),
    title text NOT NULL,
    pages integer CHECK (pages > 0),
    publish_date date NULL
);