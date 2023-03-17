const db = require('../db');

class FilmController {
    async createFilm(req, res) {
        const {title, year, genre = null} = req.body;

        try {
            const newFilm = await db.query('INSERT INTO film (title, year_of_production) VALUES ($1, $2) RETURNING *', [title, year]);

            if (genre) {
                if (typeof genre == 'string') {//если у фильма только один жанр
                    let getGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [genre]);

                    if (getGenre.rowCount == 0) {//если не существует - создается новый
                        getGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [genre]);
                    }

                    await db.query('INSERT INTO film_genre VALUES ($1, $2)', [newFilm.rows[0].film_id, getGenre.rows[0].genre_id]);
                } else {
                    for (let item of genre) {
                        let getGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [item]);

                        if (getGenre.rowCount == 0) {
                            getGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [item]);
                        }

                        await db.query('INSERT INTO film_genre VALUES ($1, $2)', [newFilm.rows[0].film_id, getGenre.rows[0].genre_id]);
                    }
                }
            }

            res.end(JSON.stringify(newFilm.rows[0]));
        } catch(err) {
            res.end(JSON.stringify(err.detail));
        }
    }

    async getFilm(req, res) {
        if(req.params.id) {
            const getFilm = await db.query(`SELECT f.film_id, f.title, f.year_of_production, string_agg(g.genre_name, ', ') AS genre 
                                            FROM film f 
                                            LEFT JOIN film_genre fg ON f.film_id = fg.film_id 
                                            LEFT JOIN genre g ON fg.genre_id = g.genre_id 
                                            WHERE f.film_id = $1
                                            GROUP BY f.film_id, f.title, f.year_of_production`, 
                                            [req.params.id]);

            res.end(JSON.stringify(getFilm.rows[0]));
        } else {
            const getFilm = await db.query(`SELECT f.film_id, f.title, f.year_of_production, string_agg(g.genre_name, ', ') AS genre 
                                            FROM film f 
                                            LEFT JOIN film_genre fg ON f.film_id = fg.film_id 
                                            LEFT JOIN genre g ON fg.genre_id = g.genre_id 
                                            GROUP BY f.film_id, f.title, f.year_of_production`);

            res.end(JSON.stringify(getFilm.rows));
        }
    }

    async updateFilm(req, res) {
        const {title, year, genre = null} = req.body;
        const id = req.body.id || req.params.id;//id может быть после '/' в URL или в body с остальными данными
        const film = await db.query('UPDATE film set title = $1, year_of_production = $2 WHERE film_id = $3 RETURNING *', [title, year, id]);
    
        if (genre) {
            await db.query('DELETE FROM film_genre WHERE film_id = $1', [id])//обновляем список жанров фильма

            if (typeof genre == 'string') {
                let getGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [genre]);

                if (getGenre.rowCount == 0) {
                    getGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [genre]);
                }

                await db.query('INSERT INTO film_genre VALUES ($1, $2)', [id, getGenre.rows[0].genre_id]);
            } else {
                for (let item of genre) {
                    let getGenre = await db.query('SELECT * FROM genre WHERE genre_name = $1', [item]);

                    if (getGenre.rowCount == 0) {
                        getGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [item]);
                    }

                    await db.query('INSERT INTO film_genre VALUES ($1, $2)', [id, getGenre.rows[0].genre_id]);
                }
            }
        }
        res.end(JSON.stringify(film.rows[0]));
    }

    async deleteFilm(req, res) {
        await db.query('DELETE FROM film_genre WHERE film_id = $1', [req.params.id]);
        await db.query('DELETE from film WHERE film_id = $1', [req.params.id]);
        res.end('Film has been deleted from database');
    }
}

module.exports = new FilmController();