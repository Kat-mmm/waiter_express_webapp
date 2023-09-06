CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE days (
    day_id SERIAL PRIMARY KEY,
    day_name VARCHAR(20) NOT NULL
);

INSERT INTO days (day_name) VALUES
    ('Monday'),
    ('Tuesday'),
    ('Wednesday'),
    ('Thursday'),
    ('Friday'),
    ('Saturday'),
    ('Sunday');

CREATE TABLE waiter_workdays (
    workday_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    day_id INT REFERENCES days(day_id)
);

CREATE TABLE waiter_selected_days (
    selection_id SERIAL PRIMARY KEY,
    waiter_id INT REFERENCES users(id),
    day_id INT REFERENCES days(day_id)
);

