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
//=====================================================
//var connection = mysql.createConnection(config.dbconfig);
class Database {
  constructor(config) {
      this.reconnect(config);
      this.config = config;
  }
  /*
  query(sql, args) {
      return new Promise((resolve, reject) => {
          this.connection.query(sql, args, (err, rows) => {
              if (err)
                  return reject(err);
              resolve(rows);
          } );
      } );
  }
  */
  close() {
      return new Promise((resolve, reject) => {
          this.connection.end(err => {
              if (err)
                  return reject(err);
              resolve();
          } );
      } );
  }
  reconnect(config) {
    this.connection = mysql.createConnection( config ); // Recreate the connection, since
                                                    // the old one cannot be reused.
    this.connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(this.reconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    this.connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        if(database != null)
          database.reconnect(config);
        else
          console.error("Database not defined in reconnect!");
        //this.reconnect(config);                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
}

let database = new Database(config.dbconfig);
//=====================================================
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
  database.connection.query(query, function (err, results) {
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
  database.connection.query(query, function (err, results) {
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
  database.connection.query(query, [req.body.Name, req.body.Question, req.body.QueueID], function(err, results) {
    if (err) throw err;
    else {
      res.send('Added a Person!');
    }
  })
});

//delete QueueMember
app.delete('/queuemembers/delete/(:id)', function(req, res) {
  database.connection.query('DELETE FROM QueueMember WHERE id = ?', [req.params.id], function (err, results) {
    if(err) throw err;
    else {
      res.send('Successfully deleted!')
    }
  })
});

//update Queue

// Get members of a queue
app.get('/queuemembers/get/(:QueueID)', function(req, res) {
  database.connection.query('SELECT * FROM QueueMember m WHERE m.QueueID = ? ORDER BY TimeAdded ASC', [req.params.QueueID], function(err, results) {
    if (err) throw err;
    else {
      res.send(results);
    }
  })
});

// Get a Queue by ID
app.get('/queues/get/(:id)', function(req, res) {
  database.connection.query('SELECT * FROM Queue q WHERE q.id = ?', [req.params.id], function(err, results) {
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
  database.connection.query(query, [generatedId, req.body.Name, req.body.Description, generatedPassword], function (err, results) {
    if(err) throw err;
      else{
        sendEmail(req.body.Email, generatedPassword)
        res.send({id: generatedId, password: generatedPassword});
      }
  })
});

//delete Queue
app.delete('/queues/delete/(:id)', function(req, res) {
  database.connection.query('DELETE FROM QueueMember WHERE QueueID = ?', [req.params.id], function (err, results) {
    if(err) throw err;
    else{
      database.connection.query('DELETE FROM Queue WHERE id = ?', [req.params.id], function (err, results) {
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
  database.connection.query('UPDATE Queue SET Name = ?, Description  = ? WHERE id = ?', [req.body.Name, req.body.Description, req.param.id], function (err, results) {
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
