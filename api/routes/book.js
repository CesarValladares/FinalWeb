//RUTAS AUTHOR
'use strict'

var express = require('express');
var bookController = require('../controllers/book');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/books'});

api.post('/book/:a_id/:e_id', md_auth.ensureAuth, bookController.createBook);
api.get('/book/:id', md_auth.ensureAuth, bookController.readBook);
api.get('/books/:a_id?', md_auth.ensureAuth, bookController.readBooks);
api.put('/book/:id/:e_id', md_auth.ensureAuth, bookController.updateBook);
api.put('/delete-book/:id/:e_id', md_auth.ensureAuth, bookController.deleteBook);

/*
api.put('/delete-author/:id/:employee', md_auth.ensureAuth, authorController.deleteAuthor);
api.post('/upload-image-author/:id', [md_auth.ensureAuth, md_upload] , authorController.uploadImage);
api.get('/get-image-author/:imageFile', authorController.getImageFile);
*/
module.exports = api;
