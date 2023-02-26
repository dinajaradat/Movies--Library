`use strict`

const express = require('express');
const server = express();



const path = require('path');
const getJson = require('./data.json');
console.log(getJson);


function conData(title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    return (this.title);
}

const conData1 = new conData(getJson.title,getJson.poster_path,getJson.overview);

server.get('/',(req,res)=>{
    res.send(conData1);
});


server.get('/favorite',(req,res)=>{
    res.send("Welcome to Favorite Page");
})

function handleError(req, res, par3) {
    return(`{ 
        "status": 404,
        "responseText": "page not found error" 
    }`);
}


const PORT = 3000;
server.listen(PORT,() =>{
    console.log(`running on port ${PORT}`);
});
