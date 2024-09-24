CREATE TABLE blogs
(
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs
    (author, url, title)
VALUES
    ('Dan Abramov', 'https://ui.dev/dan-abramov', 'Progression, Curiosity, and Burnout with Dan Abramov'),
    ('Dan Abramov', 'https://overhater.netlify.app/', 'Overreacted');