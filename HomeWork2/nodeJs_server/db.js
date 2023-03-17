const Pool = require('pg').Pool;
const pool = new Pool( {
    user: "postgres",
    password: "162534",
    host: 'localhost',
    port: 5432,
    database: 'small_films'
})

module.exports = pool;