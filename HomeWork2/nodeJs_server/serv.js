const http = require('http');
const filmHandlers = require('./controller/film_controller.js');
const genreHandlers = require('./controller/genre_controller.js');
const EventEmmiter = require('events');

const PORT = 5000;
const emitter = new EventEmmiter();

class Router {
    constructor() {
        this.endpoints = {
            '/film': {
                'GET': filmHandlers.getFilm,
                'PUT': filmHandlers.updateFilm,
                'POST': filmHandlers.createFilm,
                'DELETE': filmHandlers.deleteFilm
            },
            '/genre': {
                'GET': genreHandlers.getGenre,
                'PUT': genreHandlers.updateGenre,
                'POST': genreHandlers.createGenre,
                'DELETE': genreHandlers.deleteGenre    
            }
        };
    } 
    request(method, path) {
        emitter.on(`[${path}]:[${method}]`, (req, res) => {
            this.endpoints[path][method](req, res);
        })
    }

    startRequest() {
        Object.keys(this.endpoints).forEach(path => {
            Object.keys(this.endpoints[path]).forEach( method => {
                this.request(method, path);
            })
        })
    }
}

const router = new Router();
router.startRequest();

const server = http.createServer( (req, res) => {
    //res.end('ok');
    
    let body = "";

    req.on('data', (chunk) => {
        body += chunk;
    })

    req.on('end', () => {
        if(body) {
            req.body = JSON.parse(body);
        }

        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.send = (data) => {
            res.end(JSON.stringify(data));
        }

        const parsedUrl = new URL(req.url, 'http://localhost:5000');
        const params = {}
        parsedUrl.searchParams.forEach((value, key) => params[key] = value)

        req.pathname = parsedUrl.pathname;
        req.params = params;

        if(~req.pathname.indexOf('/', 1)) {
            const id = req.pathname.slice(req.pathname.indexOf('/', 1) + 1);
            req.params.id = id;
            req.pathname = req.pathname.slice(0, req.pathname.indexOf('/', 1));
        }

        const emitted = emitter.emit(`[${req.pathname}]:[${req.method}]`, req, res)
        if (!emitted) {
            res.end()
        }
    })
});

server.listen(PORT, () => console.log(`server ctarted on port ${PORT}`));

