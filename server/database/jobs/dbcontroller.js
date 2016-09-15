'use strict';

let Job = require('./schema.js');
let controller = require('../../controller.js');

module.exports = {
  retrieveAll: (req, res) => {
    var job = new RegExp('', 'i');
    let searchString = req.body.job;
    var re = new RegExp(searchString, 'i');
    Job.find()
      .or([{ 'jobtitle': { $regex: job } }, { 'snippet': { $regex: job } }])
      .and([{'city': { $regex: re } }]) 
      .then((results) => {
        res.status(200)
          .send(JSON.stringify(results));
      });
  }
};
