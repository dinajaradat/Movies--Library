`use strict`

const express = require('express');
const server = express();
const cors = require('cors');
server.use(cors());
const pg = require('pg');
//const path = require('path');
const getJson = require('./data.json');
const PORT = process.env.PORT || 3001;
server.use(express.json());
const axios = require('axios');
require('dotenv').config();



//Routes
server.get('/', (req, res) => {
    res.send(conData1);
})

server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})

server.get('/trending', trendingHandler);
server.get('/search', searchHandler);

server.post('/addMovie', addMovieHandler);
server.get('/getMovies', getMoviesHandler);

const conData1 = new conData(getJson.title, getJson.poster_path, getJson.overview);

server.put('/update/:id', updateMovieHandler)
server.delete('/delete/:id', deleteMovieHandler)
server.get('/getMovie/:id', getMovieById)
const client = new pg.Client(process.env.DatabaseURL);

server.get('*', (req, res) => {
    res.status(404).send("sorry, somthing went wrong");
})



//Functions

function conData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    return (this.title);
}


function Movie(id, title, name, release_date, first_air_date, poster_path, overview) {
    this.id = id;
    this.name = name || title;
    this.release_date = release_date || first_air_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


function trendingHandler(req, res) {
    try {
        const APIKey = process.env.APIKey;
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}`;
        axios.get(url)
            .then((result) => {
                let movResult = result.data.results.map((item) => {
                    let newMovie = new Movie(item.id, item.title, item.name, item.release_date, item.first_air_date, item.poster_path, item.overview);
                    return newMovie;
                })
                res.send(movResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }

}


function searchHandler(req, res) {
    try {
        const APIKey = process.env.APIKey;
        const URL = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=from&page=1`;
        axios.get(URL)
            .then((movieResult) => {
                let mapResult = movieResult.data.results.map((item) => {
                    return new Movie(item.id, item.title, item.name, item.release_date, item.first_air_date, item.poster_path, item.overview);
                });
                res.send(mapResult);
            })
            .catch((err) => {
                console.log("sorry", err);
                res.status(500).send(err);
            })
    }

    catch (error) {
        errorHandler(error, req, res);
    }
}



function addMovieHandler(req, res) {
    const movie = req.body;
    const sql = 'INSERT INTO movies (name,poster_path,overview,comment)  VALUES ($1,$2,$3,$4) RETURNING * ';
    const values = [movie.name, movie.poster_path, movie.overview, movie.comment];
    console.log(movie);
    client.query(sql, values)
        .then((data) => {
            res.send('data was added');
        })
        .catch(error => {
            res.send('error00');
        });
}


function getMoviesHandler(req, res) {
    const sql = 'SELECT * FROM movies';
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(error => {
            res.send('error');
        });
}

function updateMovieHandler(req, res) {
    const id = req.params.id;
    const movie = req.body;
    console.log(id);
    console.log(req.body);
    const sql = 'UPDATE movies  SET name =$1,poster_path =$2 ,overview = $3,comment= $4 WHERE id=$5  RETURNING * ';
    const values = [movie.name, movie.poster_path, movie.overview, movie.comment, id];

    client.query(sql, values)
        .then((data) => {
            const sql = 'SELECT * FROM movies';
            client.query(sql)
                .then((data) => {
                    res.send(data.rows);
                })
                .catch(error => {
                    res.send('error');
                });
        })
        .catch(error => {
            res.send('error');
        });

}

function deleteMovieHandler(req, res) {
    const id = req.params.id;
    const sql = `DELETE FROM movies WHERE id = ${id}`;
    client.query(sql)
        .then((data) => {
            const sql = 'SELECT * FROM movies';
            client.query(sql)
                .then((data) => {
                    res.send(data.rows);
                })
                .catch(error => {
                    res.send('error');
                });
        })
        .catch(error => {
            res.send('error00');
        });
}

function getMovieById(req, res) {
    const id = req.params.id;
    const sql = 'SELECT * FROM movies WHERE id=$1 ';
    const values = [id];

    client.query(sql, values)
        .then((data) => {
            res.send(data.rows);
        })
        .catch(error => {
            res.send('error');
        });

}


function errorHandler(error, req, res) {
    const err = {
        status: 500,
        message: error
    }
    res.send(err);
}


client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`running on port ${PORT}`);
        });
    })
    .catch(error => {
        res.send('error')
    });