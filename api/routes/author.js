//RUTAS AUTHOR
'use strict'

var express = require('express');
var authorController = require('../controllers/author');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/authors'});

api.post('/author/:m_id', md_auth.ensureAuth, authorController.createAuthor);
api.get('/author/:id', md_auth.ensureAuth, authorController.readAuthor);
api.get('/authors/:page?', md_auth.ensureAuth, authorController.readAuthors);
api.put('/author/:id/:employee', md_auth.ensureAuth, authorController.updateAuthor);
api.put('/delete-author/:id/:employee', md_auth.ensureAuth, authorController.deleteAuthor);
api.post('/upload-image-author/:id', [md_auth.ensureAuth, md_upload] , authorController.uploadImage);
api.get('/get-image-author/:imageFile', authorController.getImageFile);

module.exports = api;
