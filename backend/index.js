var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var config = require('./config.js');
var nodemailer = require('nodemailer');
var generator = require('generate-password');
var cors = require('cors');
var app = express();

//var io = require('socket.io')(server);

var http = require('http');
var https = require('https');
var fs = require('fs');

const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/helptrain.space/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/helptrain.space/privkey.pem')
};

//app.listen(8080);
https.createServer(options, app).listen(8080);

var connection = mysql.createConnection(config.dbconfig);
app.use(bodyParser.json());
app.use(cors());

function initializeTables () {
  query = 'CREATE TABLE IF NOT EXISTS Queue(\
    ID CHAR(6) NOT NULL,\
    Name VARCHAR(25) NOT NULL,\
    Description VARCHAR(150),\
    Password CHAR(10) NOT NULL,\
    PRIMARY KEY(id)\
  )';
  connection.query(query, function (err, results) {
    if (err) throw err;
  });

  query = 'CREATE TABLE IF NOT EXISTS QueueMember(\
    ID INT AUTO_INCREMENT,\
    Name VARCHAR(25) NOT NULL,\
    Question VARCHAR(50),\
    TimeAdded TIMESTAMP NOT NULL,\
    QueueID CHAR(6) NOT NULL,\
    PRIMARY KEY(id),\
    FOREIGN KEY(QueueID) REFERENCES Queue(id)\
  );';
  connection.query(query, function (err, results) {
    if (err) throw err;
  });
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

// New Queue Member
app.post('/queuemembers/new', function(req, res) {
  var query = "INSERT INTO QueueMember (Name, Question, QueueID) VALUES (?, ?, ?)"
  connection.query(query, [req.body.Name, req.body.Question, req.body.QueueID], function(err, results) {
    if (err) throw err;
    else {
      res.send('Added a Person!');
    }
  })
});

//delete QueueMember
app.delete('/queuemembers/delete/(:id)', function(req, res) {
  connection.query('DELETE FROM QueueMember WHERE id = ?', [req.params.id], function (err, results) {
    if(err) throw err;
    else {
      res.send('Successfully deleted!')
    }
  })
});

//update Queue

// Get members of a queue
app.get('/queuemembers/get/(:QueueID)', function(req, res) {
  connection.query('SELECT * FROM QueueMember m WHERE m.QueueID = ? ORDER BY TimeAdded ASC', [req.params.QueueID], function(err, results) {
    if (err) throw err;
    else {
      res.send(results);
    }
  })
});

// Get a Queue by ID
app.get('/queues/get/(:id)', function(req, res) {
  connection.query('SELECT * FROM Queue q WHERE q.id = ?', [req.params.id], function(err, results) {
    if (err) throw err;
    else {
      res.send(results);
    }
  })
});

// New Queue
app.post('/queues/new', function(req, res) {
  var query = 'INSERT INTO Queue VALUES(?, ?, ?, ?)';
  var generatedId = generateQueueID();
  var generatedPassword = generatePassword();
  connection.query(query, [generatedId, req.body.Name, req.body.Description, generatedPassword], function (err, results) {
    if(err) throw err;
      else{
        sendEmail(req.body.Email, generatedPassword)
        res.send({id: generatedId, password: generatedPassword});
      }
  })
});

//delete Queue
app.delete('/queues/delete/(:id)', function(req, res) {
  connection.query('DELETE FROM QueueMember WHERE QueueID = ?', [req.params.id], function (err, results) {
    if(err) throw err;
    else{
      connection.query('DELETE FROM Queue WHERE id = ?', [req.params.id], function (err, results) {
        if(err) throw err;
          else{
            res.send("Successfully deleted a Queue!")
          }
      });
    }
  });
});

//update Queue
app.put('/queues/update/(:id)', function(req, res) {
  connection.query('UPDATE Queue SET Name = ?, Description  = ? WHERE id = ?', [req.body.Name, req.body.Description, req.param.id], function (err, results) {
    if(err) throw err;
      else{
        res.send("Successfully updated a Queue!")
      }
  })
});

/*
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/

initializeTables();
//app.listen(8080);
