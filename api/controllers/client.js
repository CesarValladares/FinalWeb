//CONTROLADOR CLIENT
'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Client = require('../models/client');

//CRUD
var CClient = require('../models/c_client');
var UClient = require('../models/u_client');
var DClient = require('../models/d_client');
var jwt = require('../services/jwt');

var clientController = {};

//CREATE A NEW CLIENT
clientController.saveClient = (req, res) => {

  var client = new Client();
  var params = req.body;

  client.name = params.name;
  client.surname = params.surname;
  client.email = params.email;
  client.username = params.username;
  //user.role = 'ROLE_ADMIN';
  client.role = 'ROLE_USER';
  client.status = 'ACTIVE';
  client.image = 'null';
  client.balance = 0;


  if (params.password) {
    //Encriptar contraseña y guardar datos
    bcrypt.hash(params.password, null, null, function(err, hash){
      client.password = hash;
      if (client.name != null && client.surname != null && client.email != null) {

        //Guarar usuario en BD
        client.save((err, clientStored) => {
          if (err) {
            res.status(500).send({message: 'ERROR AL GUARDAR CLIENTE'});
          }
          else {
            if (!clientStored) {
              res.status(404).send({message: 'NO SE HA REGISTRADO EL CLIENTE'});
            }
            else {
              var c_client = new CClient();
              c_client.date = new Date();
              c_client.client = clientStored._id;
              if (req.params.employee) {
                c_client.employee = req.params.employee;
              }
              else {
                c_client.employee = null;
              }
              //Guarar registro de cliente borrado en BD
              c_client.save((err, cclientStored) => {
                if (err) {
                  res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE CLIENTE CREADO'});
                }
                else {
                  if (!cclientStored) {
                    res.status(404).send({message: 'NO SE HA REGISTRADO LA CREACION DE CLIENTE'});
                  }
                  else {
                    res.status(200).send({client: clientStored});
                  }
                }
              });
            }
          }
        });
      }
      else {
        res.status(200).send({message: 'Introduce todos los campos'});
      }
    });
  }
  else{
    res.status(500).send({message: 'Introduce la contraseña'});
  }
}


//LOGIN AS A CLIENT
clientController.loginClient = (req, res) => {
  var params = req.body;
  var email = params.email;
  var password = params.password;

  Client.findOne({email: email.toLowerCase()}, (err, client) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
    else {
      if (!client) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      }
      else {
        //Comprobar contraseña
        bcrypt.compare(password, client.password, (err, check) => {
          if (check) {
            //Devolver los datos del usuario logeado
            if (params.gethash) { //Generar token con objeto del usuario
                //devolver token de jwt
                res.status(200).send({
                  token: jwt.createToken(client)
                });
            }
            else {
              res.status(200).send({client});
            }
          }
          else {
            res.status(404).send({message: 'EL CLIENTE NO HA PODIDO LOGUEARSE'});
          }
        });
      }
    }
  });
}



//GET CLIENT
clientController.getClient = (req, res) => {

  var clientId = req.params.id;

  Client.findById(clientId, (err, client) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!client) {
        res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
      } else {
        res.status(200).send({client: client});
      }
    }
  });
}


//GET CLIENT
clientController.getClients = (req, res) => {

  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var itemsPerPage = 10;

  Client.find({status: 'ACTIVE'}).sort('name').paginate(page, itemsPerPage, (err, clients, total) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
    else {
      if (clients) {
        return res.status(500).send({
          total_items: total,
          clients: clients
        });
      }
      else {
        res.status(404).send({message: 'NO HAY CLIENTES'});
      }
    }
  });

}


//UPDATE CLIENT
clientController.updateClient = (req, res) => {
  var clientId = req.params.id;
  var update = req.body;

  Client.findByIdAndUpdate(clientId, update, (err, clientUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar cliente'});
    }
    else {
      if (!clientUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar al cliente'});
      }
      else {
        var u_client = new UClient();
        u_client.date = new Date();
        u_client.before = clientUpdated;
        u_client.client = clientId;
        if (req.params.employee) {
          u_client.employee = req.params.employee;
        }
        else {
          u_client.employee = null;
        }

        Client.findOne({_id: clientId}, (err, upClient) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!upClient) {
              res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
            }
            else {
              u_client.after = upClient;

              //Guarar registro de cliente borrado en BD
              u_client.save((err, uclientStored) => {
                if (err) {
                  res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE CLIENTE ACTUALIZADO'});
                }
                else {
                  if (!uclientStored) {
                    res.status(404).send({message: 'NO SE HA REGISTRADO LA ACTUALIZACION DEL CLIENTE'});
                  }
                  else {
                    res.status(200).send({upClient});
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}



//DELETE CLIENT
clientController.inactiveClient = (req,res) => {
  var clientId = req.params.id;
  var update = {status: 'INACTIVE'};

  Client.findByIdAndUpdate(clientId, update, (err, clientUpdated) => {
    if (err) {
      res.status(500).send({message: 'Error al actualizar cliente'});
    }
    else {
      if (!clientUpdated) {
        res.status(404).send({message: 'No se ha podido actualizar al cliente'});
      }
      else {
        var d_client = new DClient();
        d_client.date = new Date();
        if (req.params.employee) {
          d_client.employee = req.params.employee;
        }
        else {
          d_client.employee = null;
        }

        Client.findOne({_id: clientId}, (err, upClient) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});
          }
          else {
            if (!upClient) {
              res.status(404).send({message: 'EL CLIENTE NO EXISTE'});
            }
            else {
              d_client.client = upClient;

              //Guarar registro de cliente borrado en BD
              d_client.save((err, dclientStored) => {
                if (err) {
                  res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE CLIENTE INACTIVO'});
                }
                else {
                  if (!dclientStored) {
                    res.status(404).send({message: 'NO SE HA REGISTRADO DEL CLIENTE DESACTIVADO'});
                  }
                  else {
                    res.status(200).send({upClient});
                  }
                }
              });
            }
          }
        });
      }
    }
  });
}


//UPLOAD CLIENTS IMAGE
clientController.uploadImage = (req, res) => {

  var clientId = req.params.id;
  var file_name = 'null';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Client.findByIdAndUpdate(clientId, {image: file_name}, (err, clientUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar cliente'});
        }
        else {
          if (!clientUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar al cliente'});
          }
          else {
            res.status(200).send({image: file_name, user: clientUpdated});
          }
        }
      });
    }
    else {
      res.status(200).send({message: 'Extensión no valida'});
    }
  }
  else {
    res.status(200).send({message: 'No se ha subido ninguna imagen'});
  }
}



//GET CLIENTS IMAGE
clientController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/clients/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }
    else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}

module.exports = clientController
