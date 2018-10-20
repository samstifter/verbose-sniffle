var express = require('express');
var mysql = require('mysql');
var config = require('./config.js');
var nodemailer = require('nodemailer');
var generator = require('generate-password');
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

//generate a 6 digit room key
function generateQueueID(){
	var string = generator.generate({
    	length: 6,
    	numbers: true
	});
	return string;
}
//generate our password
function generatePassword() {
	var string = generator.generate({
    	length: 10,
    	numbers: true
	});
	return string;
}

function sendEmail(email) {
	//needs to be filled out
	var transporter = nodemailer.createTransport({
		service: '',
		auth: {
			user: 'ssti@gmx.com',
			pass: ''
		}
	});

	//text contains the 10 char randomly generated password
	var mailOptions = {
		from: 'ssti@gmx.com',//same as user from above
		to: email,
		subject: 'Here is your password for HelpTrain',
		text: generatePassword()
	};

	transporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(error);
		} else {
			console.log('Ema')
		}
	});
}
//provide email credentials, encompass this in a fucntion


app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(8080);