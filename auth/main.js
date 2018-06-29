const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Datastore = require('nedb'),
  users = new Datastore();
const uuidv1 = require('uuid/v1');
var bcrypt = require('bcrypt');
app.use(bodyParser.json());
app.use(cookieParser());
app.listen(3000, function() {
  console.log('listening on 3000');
});
app.get('/signin', (req, res) => {
  users.findOne({ username: req.query.username }, (err, doc) => {
    if (doc) {
      bcrypt.compare(req.query.password, doc.hashword, function(err, result) {
        if (result) {
          let uuid = uuidv1();
          res.cookie('sessionid', uuid, {});
          users.update(
            { username: req.query.username },
            { $push: { sessions: uuid } },
            {},
            (err, numReplaced) => {}
          );
          res.send('Signed in!');
        } else {
          res.send('Failed!');
        }
      });
    } else {
      res.send('Failed!');
    }
  });
});
app.get('/signup', (req, res) => {
  users.findOne({ username: req.query.username }, (err, doc) => {
    if (doc) {
      res.send('Nope!');
    } else {
      bcrypt.hash(req.query.password, 10, function(err, hashword) {
        bcrypt.hash(hashword + req.query.username, 10, function(err, hash) {
          let uuid = uuidv1();
          users.insert(
            {
              username: req.query.username,
              hashword: hashword,
              id: hash,
              bio: '',
              sessions: [uuid]
            },
            () => {}
          );
          res.cookie('sessionid', uuid, {});
          res.send('Signed Up! ' + hash + ' ' + uuid);
        });
      });
    }
  });
});

app.get('/', (req, res) => {
  users.findOne({ sessions: req.cookies.sessionid }, function(err, doc) {
    res.send(doc ? doc : 'Auth failed');
    console.log(err);
    console.log(doc == null);
  });
});

app.get('/setbio', (req, res) => {
  users.findOne({ sessions: req.cookies.sessionid }, (err, doc) => {
    users.update(
      { sessions: req.cookies.sessionid },
      { $set: { bio: req.query.bio } },
      {},
      (err, numReplaced => {})
    );
    res.send(doc ? 'Bio set' : 'Auth failed');
  });
});

app.get('/user', (req, res) => {
  let founduser = {};
  let found = false;
  users.findOne({ username: req.query.username }, (err, doc) => {
    if (doc != null) {
      res.send(doc.username + ': ' + doc.bio);
    } else {
      res.send('No user found');
    }
  });
});

app.get('/signout', (req, res) => {
  users.update(
    { sessions: req.cookies.sessionid },
    { $pull: { sessions: req.cookies.sessionid } },
    {},
    (err, numReplaced) => {}
  );
  res.cookie('sessionid', '');
  res.send('Signed out!');
});
