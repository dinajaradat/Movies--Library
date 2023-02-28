`use strict`

const express = require('express');
const server = express();

const PORT = 3000;

const pg = require('pg');
const client = new pg.client('process.env.DatabaseURL');

const path = require('path');
const getJson = require('./data.json');
console.log(getJson);

server.use(express.json());


const conData1 = new conData(getJson.title,getJson.poster_path,getJson.overview);

server.get('/',(req,res)=>{
    res.send(conData1);
});


server.get('/favorite',(req,res)=>{
    res.send("Welcome to Favorite Page");
})


server.get('/addMovie', addMovieHandler);



function conData(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    return (this.title);
}



function handleError(req, res, par3) {
    return(`{ 
        "status": 404,
        "responseText": "page not found error" 
    }`);
}


function addMovieHandler(req,res){

}


client.connect()
    .then(()=>{
        server.listen(PORT,() =>{
            console.log(`running on port ${PORT}`);
        });
    });



