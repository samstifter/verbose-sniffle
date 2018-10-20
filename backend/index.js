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
    if(err) throw err;
      else{
        res.send("Successfully deleted a QueueMember!")
      }
  })
});

//delete Queue
app.delete('/queue/delete/(:id)', function(req, res) {
  connection.query('DELETE FROM Queue WHERE id = ?', [req.params.id], function (err, results) {
    if(err) throw err;
      else{
        res.send("Successfully deleted a Queue!")
      }
  })
});

//update Queue
app.put('/queue/:id', function(req, res) {
  connection.query('UPDATE Queue SET Name = ' + req.body.Name + ' , Set Description  = ' + req.body.Description
  + 'WHERE id = ' + req.body.id , function (err, results) {
    if(err) throw err;
      else{
        res.send("Successfully updated a Queue!")
      }
  })
});

app.get('/', function(req, res){
   res.send('Hello world!');
});

app.listen(8080);
