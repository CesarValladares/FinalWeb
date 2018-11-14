//MODELO DELETED_CLIENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeletedClientSchema = Schema({
  last_id: String,
  name: String,
  surname: String,
  email: String,
  username: String
});

module.exports = mongoose.model('DeletedClient', DeletedClientSchema);
