//MODELO RENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RentSchema = Schema({
  date_init: Date,
  date_end: Date,
  status: String,
  total_books: Number,
  client:{
    type: Schema.ObjectId,
    ref: 'Client'
  }
});

module.exports = mongoose.model('Rent', RentSchema);
