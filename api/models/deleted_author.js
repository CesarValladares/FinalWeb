//MODELO DELETED_AUTHOR
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeletedAuthorSchema = Schema({
  last_id: String,
  name: String,
  surname: String
});

module.exports = mongoose.model('DeletedAuthor', DeletedAuthorSchema);
