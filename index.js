`use strict`


const express = require('express');
const server = express();

server.get('/trending', trendingHandler);


const axios = require('axios');

require('dotenv').config();


const getJson = require('./data.json');
console.log(getJson);




// http://localhost:3000/favorite
server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
})




// functions 
function conData(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

const conData1 = new conData(getJson.title, getJson.poster_path, getJson.overview);

server.get('/', (req, res) => {     // http://localhost:3000/
    res.send(conData1);
});



function handleError(arror, req, res) {
    return (`{ 
        "status": 404,
        "responseText": "page not found error" 
    }`);
}


function Movie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


function trendingHandler(req, res) {
    try {
        const APIKey = process.env.APIKey;
        const url = 'https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}';
        axios.get(url)
            .then((result) => {
                let movResult = result.data.results.map((item) => {
                    let newMovie = new Movie(item.id, item.title, item.release_date, item.poster_path, item.overview);
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




const PORT = 3000;
server.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});