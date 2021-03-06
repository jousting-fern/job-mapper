'use strict';

let User = require('./userschema.js');
let bcrypt = require('bcryptjs');

module.exports = {

  // this registers a new user
  addOne: (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.currentPassword, salt, (err, hash) => {
        // Creates a new hash and saves it in the user object in the db
        var user = new User({
          username: req.body.currentUsername
        });
        User.count({ username: req.body.currentUsername }, (err, count) => {
          // First we check to see if the username is already taken
          // Count is faster than the find() function- there is no need to return the existing user from the db
          if (count > 0) {
            res.status(300)
              .send('Sorry username already taken!!');
          } else {
            user.save((err) => {
              if (err) {
                return console.error('here is the error', err);
              }
            })
            .then((results) => {
              res.status(200)
                .send(JSON.stringify(results));
            });
          }
        });
      });
    });
  },

  signIn: (req, res) => {
    // var username = req.body.username;
    // var password = req.body.password;
    // var salt = bcrypt.genSaltSync(10);
    // var hash = bcrypt.hashSync(password, salt);

    User.findOne({ username: username }, (err, foundUser) => {
      if (err) {
        return handleError(err);
      }
      console.log(foundUser)
      if (foundUser) {
        // here we are comparing the password the user entered to what we have hashed in our db
        // 'test' will either return true or false depending on whether the entered password is matching up
        bcrypt.compare('password', 'password', (err, test) => {
          if (test) {
            // Here we are creating a session.
            req.session.regenerate(() => {
              req.session.user = foundUser.username;
              res.redirect('/');
            });
          } else {
            res.status(305)
              .send('Sorry seems that is an incorrect password');
          }
        });
      } else {
        res.status(300)
          .send('Sorry that username does not exist');
      }
    });
  },

  // this loads up the user's favorite's list when they login
  getJobs: (req, res) => {
    //console.log(req.body)
    var username = req.body.username;
    User.findOrCreate({ username: username }, (err, foundUser) => {
      if (foundUser) {
        console.log(foundUser)
        res.send(foundUser.savedJobs);
      } else {
        console.log(err)
        res.status(300)
          .send('Sorry that username does not exist');
      }
    });
  },

  // This adds a job to 'saved jobs' sidebar that user sees on homepage
  addJob: (req, res) => {
    let username = req.body.username;
    let job = req.body.job;
    User.findOneAndUpdate(
      { username: username },
      { $push: {savedJobs: job} },
      (err, model) => {
        if (err) { console.log(err); }
        res.sendStatus(201);
      });
  },

  // This removes a job from the 'saved jobs' sidebar
  removeJob: (req, res) => {
    let jobkey = req.body.jobkey;
    let username = req.body.username;
    let foundIndex;
    User.findOneAndUpdate(
      { username: username },
      { $pull: {savedJobs: {jobkey: jobkey} } },
      (err, model) => {
        if (err) { console.log(err); }
        res.sendStatus(200);
      });
  }

};
