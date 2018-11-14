//MODELO RENT_REGISTER
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RentRegisterSchema = Schema({
  status: String,
  rent:{
    type: Schema.ObjectId,
    ref: 'Rent'
  },
  book:{
    type: Schema.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('RentRegister', RentRegisterSchema);
