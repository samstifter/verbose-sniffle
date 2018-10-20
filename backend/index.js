var express = require('express');
var mongoose = require('mongoose');
var app = express();

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(8080);