var express = require('express');
var mysql = require('mysql');
var config = require('./config.js');
var app = express();

var connection = mysql.createConnection(config.dbconfig);

function executeQuery(query) {
  connection.query(query, function (error, results) {
    if (error) throw error;
    return results;
  });
}

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(8080);
