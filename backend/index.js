var express = require('express');
var mysql = require('mysql');
var config = require('./config.js');
var nodemailer = require('nodemailer');
var generator = require('generate-password');
var app = express();
var connection = mysql.createConnection(config.dbconfig);

function initializeTables () {
  executeQuery('CREATE TABLE IF NOT EXISTS Queue(\
    id CHAR(6) NOT NULL,\
    name VARCHAR(25) NOT NULL,\
    description VARCHAR(150),\
    password CHAR(10) NOT NULL,\
    PRIMARY KEY(id)\
  )');

  executeQuery('CREATE TABLE IF NOT EXISTS QueueMember(\
    id INT AUTO_INCREMENT,\
    name VARCHAR(25),\
    question VARCHAR(50),\
    QueueID CHAR(6) NOT NULL,\
    PRIMARY KEY(id),\
    FOREIGN KEY(QueueID) REFERENCES Queue(id)\
  );');
}

//generate a 6 digit room key
function generateQueueID(){
	var string = generator.generate({
    	length: 6,
    	numbers: true,
      uppercase: false,
      excludeSimilarCharacters:true,
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

function sendEmail(email, passwordToSend) {
	//needs to be filled out
	var transporter = nodemailer.createTransport({
		host: config.emailconfig.host,
    port: config.emailconfig.port,
    secure: config.emailconfig.secure,
		auth: {
			user: config.emailconfig.username,
			pass: config.emailconfig.password,
		}
	});

	//text contains the 10 char randomly generated password
	var mailOptions = {
		from: config.emailconfig.username,//same as user from above
		to: email,
		subject: 'Here is your password for HelpTrain',
		text: passwordToSend
	};

	transporter.sendMail(mailOptions, function(err, info){
		if(err){
			console.log(err);
		} else {
			console.log('Email Sent')
		}
	});
}


//delete QueueMember
app.delete('/queuemembers/delete/(:id)', function(req, res) {
  connection.query('DELETE FROM QueueMember WHERE id = ?', [req.params.id], function (err, results) {
    if(err) throw error;
    else{
      res.send('Successfully deleted!')
    }
  })
});

//update Queue

// Get members of a queue
app.get('/queuemembers/get/(:QueueID)', function(req, res) {
  connection.query('SELECT * FROM QueueMember m WHERE m.QueueID = ?', [req.params.QueueID], function(err, results) {
    if (err) throw err;
    else {
      res.send(results);
    }
  })
});

// Get a Queue by ID
app.get('/queue/get/(:id)', function(req, res) {
  connection.query('SELECT * FROM Queue q WHERE q.id = ?', [req.params.id], function(err, results) {
    if (err) throw err;
    else {
      res.send(results);
    }
  })
});

app.get('/', function(req, res){
   res.send('Hello world!');
});

app.listen(8080);
