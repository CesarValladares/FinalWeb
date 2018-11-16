//CONTROLADOR ARTIST
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Book = require('../models/book');
var Author = require('../models/author');
var CBook = require('../models/c_book');
var UBook = require('../models/u_book');
var DBook = require('../models/d_book');


var bookController = {};

//CREATE A SONG IN AN ALBUM
bookController.createBook = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN' && req.headers.role != 'ROLE_EMPLOYEE') {
      res.status(500).send({message: 'ERROR EN LA PETICION___'});

    } else {

      var book = new Book();
      var authorId = req.params.a_id;
      var employeeId = req.params.e_id;

      var params = req.body;
      book.title = params.title;
      book.description = params.description;
      book.genre = params.genre;
      book.year = params.year;
      book.pages = params.pages;
      book.editorial = params.editorial;
      book.total = params.total;
      book.onloan = 0;
      book.inhouse = params.total;
      book.author = authorId;
      book.status = 'ACTIVE';
      book.image = '';
      book.file = '';

      if (!book.title || !book.description || !book.genre || !book.year || !book.pages || !book.editorial || !book.total) {
        res.status(501).send({message: 'LLENE TODOS LOS CAMPOS'});

      } else {

        book.save((err, bookStored) => {
          if (err) {
            res.status(500).send({message: 'ERROR AL GUARDAR LIBRO'});
          } else {
            if (!bookStored) {
              res.status(404).send({message: 'EL LIBRO NO HA SIDO GUARDADO'});
            } else {
              var c_book = new CBook();
              c_book.date = new Date();
              c_book.employee = employeeId;
              c_book.book = bookStored._id;

              //Guarar registro de autor creado en BD
              c_book.save((err, cbookStored) => {
                if (err) {
                  res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO LIBRO CREADO'});

                } else {
                  if (!cbookStored) {
                    res.status(404).send({message: 'NO SE HA REGISTRADO LA CREACION DEL LIBRO'});

                  } else {
                    res.status(200).send({book: bookStored});
                  }
                }
              });
            }
          }
        });

      }
    }
  }
}

//GET A BOOK
bookController.readBook = (req, res) => {

  var bookId = req.params.id;

  Book.findById(bookId).populate({path: 'author'}).exec((err, book) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!book) {
        res.status(404).send({message: 'EL LIBRO NO EXISTE'});
      } else {
        res.status(200).send({book: book});
      }
    }
  });
}



//GET BOOKS
bookController.readBooks = (req, res) => {
  var authorId = req.params.a_id;

  if (!authorId) { //Sacar todos los libros de BD
    var find = Book.find({}).sort('title');
  } else { //Saca libros de autor
    var find = Book.find({author: authorId}).sort('name');
  }

  find.populate({path: 'author'}).exec((err, books) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!books) {
        res.status(404).send({message: 'NO HAY LIBROS'});
      } else {
        res.status(200).send({books});
      }
    }
  });
}

//UPDATE BOOK
bookController.updateBook = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN' && req.headers.role != 'ROLE_EMPLOYEE') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var bookId = req.params.id;
      var employeeId =req.params.e_id;
      var update = req.body;

      Book.findByIdAndUpdate(bookId, update, (err, bookUpdated) => {
        if (err) {
          res.status(500).send({message: 'ERROR AL ACTUALIZAR LIBRO'});
        } else {
          if (!bookUpdated) {
            res.status(404).send({message: 'EL LIBRO NO HA SIDO ACTUALIZADO'});
          } else {

            var u_book = new UBook();
            u_book.date = new Date();
            u_book.before = bookUpdated;
            u_book.employee = employeeId;
            u_book.book = bookUpdated._id;


            Book.findOne({_id: bookId}, (err, upBook) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!upBook) {
                  res.status(404).send({message: 'EL LIBRO NO EXISTE'});

                } else {
                  u_book.after = upBook;

                  //Guarar registro de LIBRO ACTUALIZADO en BD
                  u_book.save((err, ubookStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE LIBRO ACTUALIZADO'});

                    } else {
                      if (!ubookStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO LA ACTUALIZACION DEL LIBRO'});

                      } else {
                        //RETURN UPDATED EMPLOYEE
                        res.status(200).send({upBook});
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



//DELETE BOOK
bookController.deleteBook = (req,res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var bookId = req.params.id;
      var update = {status: 'INACTIVE'};

      Book.findByIdAndUpdate(bookId, update, (err, bookUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al eliminar libro'});

        } else {
          if (!bookUpdated) {
            res.status(404).send({message: 'No se ha podido eliminar al cliente'});

          } else {
            var d_book = new DBook();
            d_book.date = new Date();
            d_book.employee = req.params.e_id;

            Book.findOne({_id: bookId}, (err, delBook) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!delBook) {
                  res.status(404).send({message: 'EL LIBRO NO EXISTE'});

                } else {
                  d_book.book = delBook._id;

                  //Guarar registro de empleado eliminado en BD
                  d_book.save((err, dbokStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE LIBRO INACTIVO'});

                    } else {
                      if (!dbokStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO DEL LIBRO INACTIVO'});

                      } else {
                        res.status(200).send({delBook});
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
bookController.uploadImage = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION___'});

    } else {
      var bookId = req.params.id;
      var file_name = 'null';

      if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_path.split('.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
          Book.findByIdAndUpdate(bookId, {image: file_name}, (err, bookUpdated) => {
            if (err) {
              res.status(500).send({message: 'Error al actualizar imagen del libro'});

            } else {
              if (!bookUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar la imagen del libro'});

              } else {
                res.status(200).send({image: file_name, book: bookUpdated});
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
bookController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/books/images/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    }
    else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}




bookController.uploadBookFile = (req, res) => {
  var bookId = req.params.id;
  var file_name = 'null';

  if (req.files) {
    var file_path = req.files.file.path;
    var file_split = file_path.split('/');
    var file_name = file_split[3];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'pdf') {
      Book.findByIdAndUpdate(bookId, {file: file_name}, (err, bookUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar LIBRO'});

        } else {
          if (!bookUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el libro'});

          } else {
            res.status(200).send({book: bookUpdated});
          }
        }
      });
    } else {
      res.status(200).send({message: 'Extensión no valida'});
    }

  } else {
    res.status(200).send({message: 'No se ha subido ningun file'});
  }

}

bookController.getBookFile = (req, res) => {
  var bookFile = req.params.bookFile;
  var path_file = './uploads/books/files/' + bookFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({message: 'No existe el libro'});
    }
  });
}

/*
*/
module.exports = bookController;
