//MODELO D_CLIENT
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DBookSchema = Schema({
  date: Date,
  employee:{
    type: Schema.ObjectId,
    ref: 'Employee'
  },
  deleted_book:{
    type: Schema.ObjectId,
    ref: 'DeletedBook'
  }
});

module.exports = mongoose.model('DBook', DBookSchema);
