var express = require('express');
var mysql = require('mysql');
var config = require('./config.js');
var app = express();

var connection = mysql.createConnection({
  host: "localhost",
  user: config.dbUser,
  password: config.dbPassword
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to db");
});

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(8080);
