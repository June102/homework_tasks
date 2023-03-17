CREATE TABLE genre
(
	genre_id serial PRIMARY KEY,
	genre_name varchar(30) NOT NULL UNIQUE
);

CREATE TABLE country
(
	country_id serial PRIMARY KEY,
	country_name varchar(30) UNIQUE NOT NULL
);

CREATE TABLE viewers
(
	view_id serial PRIMARY KEY,
	country_id int REFERENCES country(country_id) ,
	number_of_viewers int
);

CREATE TABLE person
(
	person_id serial PRIMARY KEY,
	person_name varchar(40) NOT NULL,
	age int
);

CREATE TABLE rating_MPAA
(
	rating_id serial PRIMARY KEY,
	rating varchar(5) UNIQUE NOT NULL,
	description text
);

CREATE TABLE review
(
	review_id serial PRIMARY KEY,
	user_name varchar(20) NOT NULL,
	review_text text
);

CREATE TABLE film
(
	film_id serial PRIMARY KEY,
	title varchar(50) NOT NULL,
	year_of_production date,
	duration time,
	age_restrict int,
	country int REFERENCES country(country_id),
	slogan text,
	film_director int REFERENCES person(person_id),
	screenwriter int REFERENCES person(person_id),
	produser int REFERENCES person(person_id),
	film_operator int REFERENCES person(person_id),
	composer int REFERENCES person(person_id),
	artist int REFERENCES person(person_id),
	film_editor int REFERENCES person(person_id),
	budget money,
	marketing money,
	fees money,
	premiere date,
	DVD_release date,
	MPAA_rating int REFERENCES rating_MPAA(rating_id),
	rating real,
	video_file_link text UNIQUE NOT NULL
);

CREATE TABLE film_genre
(
	film_id int REFERENCES film(film_id),
	genre_id int REFERENCES genre(genre_id),
	
	CONSTRAINT pk_film_genre PRIMARY KEY (film_id, genre_id)
);

CREATE TABLE film_viewers
(
	film_id int REFERENCES film(film_id),
	view_id int REFERENCES viewers(view_id),
	
	CONSTRAINT pk_film_viewers PRIMARY KEY (film_id, view_id)
);

CREATE TABLE starring
(
	film_id int REFERENCES film(film_id),
	person_id int REFERENCES person(person_id),
	
	CONSTRAINT pk_starring PRIMARY KEY (film_id, person_id)
);

CREATE TABLE roles_dupl
(
	film_id int REFERENCES film(film_id),
	person_id int REFERENCES person(person_id),
	
	CONSTRAINT pk_roles_dupl PRIMARY KEY (film_id, person_id)
);

CREATE TABLE film_review
(
	film_id int REFERENCES film(film_id),
	review_id int REFERENCES review(review_id),
	
	CONSTRAINT pk_film_review PRIMARY KEY (film_id, review_id)
);