//CONTROLADOR ARTIST
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Employee = require('../models/employee');
var Rent = require('../models/rent');

var CBook = require('../models/c_book');
var CAuthor = require('../models/c_author');
var CEmployee = require('../models/c_employee');
var CClient = require('../models/c_client');

var DBook = require('../models/d_book');
var DAuthor = require('../models/d_author');
var DEmployee = require('../models/d_employee');
var DClient = require('../models/d_client');

var UBook = require('../models/u_book');
var UAuthor = require('../models/u_author');
var UEmployee = require('../models/u_employee');
var UClient = require('../models/u_client');


var registerController = {};

//GET A RENT INFO
/*
in header send the next params
  Autorization: token_of_the_user
  role: ROLE_ADMIN (It is stored in the client or employee atributes as role: )

in the request parameters send the next atributes in the express url
  id: id_of_the_created_book_register (this is mandatory)
*/
registerController.readCreatedBook = (req, res) => {

  var cbookId = req.params.id;

  CBook.findById(cbookId).populate([{path: 'employee'}, {path: 'book'} ]).exec((err, cbook) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!cbook) {
        res.status(404).send({message: 'SIN REGISTRO'});
      } else {
        res.status(200).send({book_creation: cbook});
      }
    }
  });
}

//GET CREATED BOOK REGISTERS
registerController.readCreatedBooks = (req, res) => {

  var employeeId = req.params.e_id;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = CBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = CBook.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'book'}]).exec((err, cbooks) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!cbooks) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({cbooks});
      }
    }
  });
}


registerController.readUpdatedBook = (req, res) => {

  var ubookId = req.params.id;

  UBook.findById(ubookId).populate([{path: 'employee'}, {path: 'book'} ]).exec((err, ubook) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!ubook) {
        res.status(404).send({message: 'SIN REGISTRO'});
      } else {
        res.status(200).send({book_update: ubook});
      }
    }
  });
}

//GET CREATED BOOK REGISTERS
registerController.readUpdatedBooks = (req, res) => {

  var employeeId = req.params.e_id;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = UBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = UBook.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'book'}]).exec((err, ubooks) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!ubooks) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({ubooks});
      }
    }
  });
}



registerController.readDeletedBook = (req, res) => {

  var dbookId = req.params.id;

  DBook.findById(dbookId).populate([{path: 'employee'}, {path: 'book'} ]).exec((err, dbook) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!dbook) {
        res.status(404).send({message: 'SIN REGISTRO'});
      } else {
        res.status(200).send({book_deletion: dbook});
      }
    }
  });
}

//GET CREATED BOOK REGISTERS
registerController.readDeletedBooks = (req, res) => {

  var employeeId = req.params.e_id;

  if (!employeeId) { //Sacar todos las rentas de BD
    var find = DBook.find({}).sort('date');
  } else { //Saca rentas del cliente
    var find = DBook.find({employee: employeeId}).sort('date');
  }

  find.populate([{path: 'employee'},{path: 'book'}]).exec((err, dbooks) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!dbooks) {
        res.status(404).send({message: 'NO HAY REGISTROS'});
      } else {
        res.status(200).send({dbooks});
      }
    }
  });
}


module.exports = registerController;
