//CONTROLADOR AUTHOR
'use strict'
var fs = require('fs');
var path = require('path');
var Author = require('../models/author');

//CRUD
var CAuthor = require('../models/c_author');
var UAuthor = require('../models/u_author');
var DAuthor = require('../models/d_author');
var jwt = require('../services/jwt');

var authorController = {};



//CREATE A NEW AUTHOR
authorController.createAuthor = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {

        var author = new Author();
        var params = req.body;
        var employeeId = req.params.m_id;

        author.name = params.name;
        author.surname = params.surname;
        author.description = params.description;
        author.image = 'null';
        author.status = 'ACTIVE';

        if (author.name != null && author.surname != null && author.description != null) {
          //Guarar autor en BD
          author.save((err, authorStored) => {

            if (err) {
              res.status(500).send({message: 'ERROR AL GUARDAR AUTOR'});

            } else {
              if (!authorStored) {
                res.status(404).send({message: 'NO SE HA GUARDADO AL AUTOR'});

              } else {
                var c_author = new CAuthor();
                c_author.date = new Date();
                c_author.employee = employeeId;
                c_author.author = authorStored._id;

                //Guarar registro de autor creado en BD
                c_author.save((err, cauthorStored) => {
                  if (err) {
                    res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE AUTOR CREADO'});

                  } else {
                    if (!cauthorStored) {
                      res.status(404).send({message: 'NO SE HA REGISTRADO LA CREACION DEL AUTOR'});

                    } else {
                      res.status(200).send({author: authorStored});
                    }
                  }
                });
              }
            }
          });

        } else {
          res.status(200).send({message: 'Introduce todos los campos para crear un nuevo autor'});
        }
    }
  }
}



//GET CLIENT
authorController.readAuthor = (req, res) => {

  var authorId = req.params.id;

  Author.findById(authorId, (err, author) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION GET AUTHOR'});
    } else {
      if (!author) {
        res.status(404).send({message: 'EL AUTOR NO EXISTE'});
      } else {
        res.status(200).send({author: author});
      }
    }
  });
}



//GET CLIENTS
authorController.readAuthors = (req, res) => {

  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var itemsPerPage = 3;

  Author.find({status: 'ACTIVE'}).sort('name').exec(function(err, authors){
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (authors) {
        Author.count({status: 'ACTIVE'}, function(err, count) {
           if (err) {
             res.status(500).send({message: 'ERROR EN LA PETICION'});

           } else {
             return res.status(500).send({
               total: count,
               authors: authors
             });
           }
        });
      } else {
        res.status(404).send({message: 'NO HAY ARTISTAS'});
      }
    }
  });
}



//UPDATE CLIENT
authorController.updateAuthor = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var authorId = req.params.id;
      var employeeId = req.params.employee;
      var update = req.body;

      Author.findByIdAndUpdate(authorId, update, (err, authorUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar autor'});

        } else {
          if (!authorUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar al autor'});

          } else {
            var u_author = new UAuthor();
            u_author.date = new Date();
            u_author.before = authorUpdated;
            u_author.employee = employeeId;
            u_author.author = authorUpdated._id;

            Author.findOne({_id: authorId}, (err, upAuthor) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!upAuthor) {
                  res.status(404).send({message: 'EL AUTOR NO EXISTE'});

                } else {
                  u_author.after = upAuthor;

                  //Guarar registro de autor modificado en BD
                  u_author.save((err, uauthorStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE AUTOR ACTUALIZADO'});

                    } else {
                      if (!uauthorStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO LA ACTUALIZACION DEL AUTOR'});

                      } else {
                        res.status(200).send({upAuthor});
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
  }
}



//DEACTIVATE AUTHOR
authorController.deleteAuthor = (req,res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var employeeId = req.params.employee;
      var authorId = req.params.id;
      var update = {status: 'INACTIVE'};

      Author.findByIdAndUpdate(authorId, update, (err, authorUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar cliente'});

        } else {
          if (!authorUpdated) {
            res.status(404).send({message: 'No se ha podido inactivar al autor'});

          } else {
            var d_author = new DAuthor();
            d_author.date = new Date();
            d_author.employee = employeeId;

            Author.findOne({_id: authorId}, (err, upAuthor) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!upAuthor) {
                  res.status(404).send({message: 'EL AUTOR NO EXISTE'});

                } else {
                  d_author.author = upAuthor;

                  //Guarar registro de autor inhabilitado en BD
                  d_author.save((err, dauthorStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE AUTOR INACTIVO'});

                    } else {
                      if (!dauthorStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO AL AUTOR DESACTIVADO'});

                      } else {
                        res.status(200).send({upAuthor});
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
  }
}


//UPLOAD CLIENTS IMAGE
authorController.uploadImage = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var authorId = req.params.id;
      var file_name = 'null';

      if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var ext_split = file_path.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
          Author.findByIdAndUpdate(authorId, {image: file_name}, (err, authorUpdated) => {
            if (err) {
              res.status(500).send({message: 'Error al actualizar cliente'});

            } else {
              if (!authorUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar la imagen del autor'});

              } else {
                res.status(200).send({image: file_name, author: authorUpdated});
              }
            }
          });

        } else {
          res.status(200).send({message: 'Extensión no valida'});
        }

      } else {
        res.status(200).send({message: 'No se ha subido ninguna imagen'});
      }
    }
  }
}



//GET CLIENTS IMAGE
authorController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/authors/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }
    else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}

module.exports = authorController
