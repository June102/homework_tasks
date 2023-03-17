create table genre
(
	genre_id serial PRIMARY KEY,
	genre_name varchar(20)
);

create table film
(
	film_id serial PRIMARY KEY,
	title varchar(40),
	year_of_production date
);

create table film_genre
(
	film_id int REFERENCES film(film_id),
	genre_id int REFERENCES genre(genre_id),
	
	CONSTRAINT pk_film_genre PRIMARY KEY (film_id, genre_id)
)

alter table film add constraint unique_films unique (title, year_of_production)
