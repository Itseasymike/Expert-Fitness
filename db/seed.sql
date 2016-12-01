DROP TABLE IF EXISTS upperbody;
DROP TABLE IF EXISTS lowerbody;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE upperbody (
  id SERIAL PRIMARY KEY,
  name VARCHAR (255) NOT NULL,
  body_part VARCHAR (255) NOT NULL
);

CREATE TABLE lowerbody (
  id SERIAL PRIMARY KEY,
  workout_name VARCHAR (255) NOT NULL,
  body_part VARCHAR (255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR (255) NOT NULL,
  email VARCHAR (255) NOT NULL,
  password_digest VARCHAR(255) NOT NULL
);

CREATE TABLE meals (
  id SERIAL PRIMARY KEY,
  food_name VARCHAR (255) NOT NULL,
  calories VARCHAR (255) NOT NULL,
  user_id SERIAL REFERENCES users(id)
);


COPY upperbody
  (name, body_part)
FROM '/Users/student_13/Desktop/project_2/db/workout_one.csv'
    DELIMITER ',' CSV;


COPY lowerbody
  (workout_name, body_part)
FROM '/Users/student_13/Desktop/project_2/db/workout_two.csv'
    DELIMITER ',' CSV;
