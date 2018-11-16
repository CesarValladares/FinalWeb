//APP
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var employee_routes = require('./routes/employee');
var client_routes = require('./routes/client');
var author_routes = require('./routes/author');
var book_routes = require('./routes/book');
var rent_routes = require('./routes/rent');
var register_routes = require('./routes/registers');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras http
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Autorizathion, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, status');
  res.header('Acces-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//Rutas base
app.use('/api', employee_routes);
app.use('/api', client_routes);
app.use('/api', author_routes);
app.use('/api', book_routes);
app.use('/api', rent_routes);
app.use('/api', register_routes);

module.exports = app;
