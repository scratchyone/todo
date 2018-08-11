const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Datastore = require('nedb'),
  users = new Datastore({ filename: 'users.db', autoload: true });
var cors = require('cors');
const uuidv1 = require('uuid/v1');
var bcrypt = require('bcrypt');
app.use(bodyParser.json());
app.use(cookieParser());
var allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'http://localhost:3001',
  'https://www.scratchyone.com'
];
app.use(
  cors({
    credentials: true,
    origin: function(origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);
app.listen(3000, function() {
  console.log('listening on 3000');
});
app.post('/signin', (req, res) => {
  users.findOne({ username: req.body.username }, (err, doc) => {
    if (doc) {
      bcrypt.compare(req.body.password, doc.hashword, function(err, result) {
        if (result) {
          let uuid = uuidv1();
          res.cookie('sessionid', uuid, {
            expires: new Date(new Date().setMonth(new Date().getMonth() + 1))
          });
          users.update(
            { username: req.body.username },
            { $push: { sessions: uuid } },
            {},
            (err, numReplaced) => {}
          );
          res.send({ success: true, sessionid: uuid });
          console.log(req.body.username + ' signed in.');
        } else {
          res.send({ success: false, error: 'Username/password incorrect' });
        }
      });
    } else {
      res.send({ success: false, error: 'Username/password incorrect' });
    }
  });
});
app.post('/signup', (req, res) => {
  users.findOne({ username: req.body.username }, (err, doc) => {
    if (doc) {
      res.send({ success: false, error: 'Account already exists' });
    } else {
      bcrypt.hash(req.body.password, 10, function(err, hashword) {
        bcrypt.hash(hashword + req.body.username, 10, function(err, hash) {
          let uuid = uuidv1();
          users.insert(
            {
              username: req.body.username,
              hashword: hashword,
              id: hash,
              todos: [],
              sessions: [uuid]
            },
            () => {}
          );
          res.cookie('sessionid', uuid, {
            expires: new Date(new Date().setMonth(new Date().getMonth() + 1))
          });
          res.send({ success: true, sessionid: uuid });
          console.log(req.body.username + ' made an account.');
        });
      });
    }
  });
});

app.get('/info', (req, res) => {
  users.findOne({ sessions: req.cookies.sessionid }, function(err, doc) {
    let newdoc = doc;
    if (doc) newdoc.authorized = true;
    res.send(
      doc
        ? {
            authorized: true,
            sessionid: doc.sessionid,
            username: doc.username,
            todos: doc.todos
          }
        : { authorized: false }
    );
    if (err) console.log(err);
  });
});

app.get('/', (req, res) => {
  users.findOne({ sessions: req.cookies.sessionid }, function(err, doc) {
    let newdoc = doc;
    if (doc) newdoc.authorized = true;
    res.send(
      doc
        ? { authorized: true, sessionid: doc.sessionid }
        : { authorized: false }
    );
    if (err) console.log(err);
  });
});

app.post('/settodos', (req, res) => {
  users.findOne({ sessions: req.cookies.sessionid }, (err, doc) => {
    users.update(
      { sessions: req.cookies.sessionid },
      { $set: { todos: req.body.todos } },
      {},
      (err, numReplaced => {})
    );
    res.send(
      doc
        ? { success: true }
        : { success: false, error: 'Incorrect session id' }
    );
    console.log(doc.username + ' updated their todos.');
  });
});

app.get('/user', (req, res) => {
  let founduser = {};
  let found = false;
  users.findOne({ username: req.query.username }, (err, doc) => {
    if (doc != null) {
      res.send({ success: true, username: doc.username, todos: doc.todos });
    } else {
      res.send({ success: false, error: 'User not found' });
    }
  });
});

app.post('/signout', (req, res) => {
  users.update(
    { sessions: req.cookies.sessionid },
    { $pull: { sessions: req.cookies.sessionid } },
    {},
    (err, numReplaced) => {}
  );
  res.cookie('sessionid', '');
  res.send({ success: true });
  console.log('A user signed out.');
});
