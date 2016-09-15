'use strict';

let mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

let userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  savedJobs: {type: Array}
});

userSchema.plugin(findOrCreate);

let User = mongoose.model('User', userSchema);

module.exports = User;
