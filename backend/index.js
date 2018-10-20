var express = require('express');
var mysql = require('mysql');
var config = require('./config.js');
var nodemailer = require('nodemailer');
var generator = require('generate-password');
var app = express();
var connection = mysql.createConnection(config.dbconfig);

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to db");
});

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