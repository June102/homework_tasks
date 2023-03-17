const db = require('../db');

class GenreController {
    async createGenre(req, res) {
        const genre_name = req.body.genre || req.params.genre;

        try {
            const newGenre = await db.query('INSERT INTO genre (genre_name) VALUES ($1) RETURNING *', [genre_name]);

            res.end(JSON.stringify(newGenre.rows[0]));
        } catch(err) {
            res.end(JSON.stringify(err.detail));
        }
    }

    async getGenre(req, res) {
        const id = req.body.id || req.params.id;

        if(id) {
            const getGenre = await db.query(`SELECT g.genre_id, g.genre_name, string_agg(f.title, ', ') as titles
                                            FROM genre g
                                            LEFT JOIN film_genre fg ON g.genre_id = fg.genre_id 
                                            LEFT JOIN film f ON fg.film_id = f.film_id
                                            WHERE g.genre_id = $1
                                            GROUP BY g.genre_id, g.genre_name`, 
                                            [id]);

            res.end(JSON.stringify(getGenre.rows[0]));
        } else {
            const getGenre = await db.query(`SELECT g.genre_id, g.genre_name, string_agg(f.title, ', ') as titles
                                            FROM genre g
                                            LEFT JOIN film_genre fg ON g.genre_id = fg.genre_id
                                            LEFT JOIN film f ON fg.film_id = f.film_id
                                            GROUP BY g.genre_id, g.genre_name`);

            res.end(JSON.stringify(getGenre.rows));
        }
    }

    async updateGenre(req, res) {
        const {genre_name} = req.body;
        const id = req.body.id || req.params.id;
        const genre = await db.query('UPDATE genre set genre_name = $1 WHERE genre_id = $2 RETURNING *', [genre_name, id]);
        
        res.end(JSON.stringify(genre.rows[0]));
    }

    async deleteGenre(req, res) {
        const id = req.body.id || req.params.id;
        await db.query('DELETE FROM film_genre WHERE genre_id = $1', [id]);
        await db.query('DELETE FROM genre WHERE genre_id = $1', [id]);
        res.end('Genre has been deleted from database');
    }
}

module.exports = new GenreController();