'use strict';

let Job = require('./schema.js');
let controller = require('../../controller.js');

var salt = function (chars) {
  return Math.ceil(Math.random() * (Math.pow(36, chars) - Math.pow(36, chars - 1)) + Math.pow(36, chars - 1)).toString(36)
};

module.exports = {
  retrieveAll: (req, res) => {
    let searchString = req.body.job;
    var job = new RegExp(searchString, 'i');
    Job.find()
      .or([{ 'jobtitle': { $regex: job } }, { 'snippet': { $regex: job } }])
      .and([{'city': req.body.city}]) 
      .then((results) => {
        res.status(200)
          .send(JSON.stringify(results));
      });
  },
  
  userCreate: (req, res) => {
    console.log(req, 'THIS IS THE STUFF')
    Job.create({
      jobtitle: req.body.jobTitle,
      company: req.body.company,
      city: req.body.city,
      state: req.body.state,
      snippet: req.body.snippet,
      url: req.body.url,
      results: {},
      jobkey: salt(20),
      user: req.body.email
    })
    .then(function () {
      res.sendStatus(201);
    })
    .catch(function (err) {
      console.log(err);
    });
  }
};
