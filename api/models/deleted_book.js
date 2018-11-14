//MODELO DELETED_BOOK
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeletedBookSchema = Schema({
  last_id: String,
  title: String
});

module.exports = mongoose.model('DeletedBook', DeletedBookSchema);
