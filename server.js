`use strict`

const express = require('express');
const server = express();
const PORT = 3000;
require('dotenv').config();
const cors = require('cors');
server.use(cors());
const pg = require('pg');
const path = require('path');
const getJson = require('./data.json');



server.use(express.json());
server.post('/addMovie', addMovieHandler);
server.get('/getMovies', getMoviesHandler);

const client = new pg.Client(process.env.DatabaseURL);



const conData1 = new conData(getJson.title, getJson.poster_path, getJson.overview);

server.get('/', (req, res) => {
    res.send(conData1);
});


server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})



function conData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    return (this.title);
}



function handleError(req, res, par3) {
    return (`{ 
        "status": 404,
        "responseText": "page not found error" 
    }`);
}

function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = 'INSERT INTO movies(movieName,comments) VALUES($1,$2) RETURNING * ';
    const values = [movie.movieName, movie.comments];
    console.log(movie);
    client.query(sql,values)
    .then((data) => {
        res.send("your data was added !");
    })
    .catch(error => {
        res.send('error00')
    });
}


function getMoviesHandler(req,res){
    const sql = 'SELECT * FROM movies';
    client.query(sql)
    .then((data) => {
        res.send(data.rows);
    })
    .catch(error => {
        res.send('error')
    });
}


client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`running on port ${PORT}`);
    });
})
.catch(error => {
    res.send('error')
});



