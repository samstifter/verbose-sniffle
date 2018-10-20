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

function initializeTables () {
  executeQuery("CREATE TABLE IF NOT EXISTS Queue(\
    id CHAR(6) NOT NULL,\
    name VARCHAR(25) NOT NULL,\
    description VARCHAR(150),\
    password CHAR(10) NOT NULL,\
    PRIMARY KEY(id)\
  )");

  executeQuery("CREATE TABLE IF NOT EXISTS QueueMember(\
    id INT AUTO_INCREMENT,\
    name VARCHAR(25),\
    question VARCHAR(50),\
    QueueID CHAR(6) NOT NULL,\
    PRIMARY KEY(id),\
    FOREIGN KEY(QueueID) REFERENCES Queue(id)\
  );");
}

app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(8080);
