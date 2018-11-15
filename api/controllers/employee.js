//CONTROLADOR EMPLOYEE
'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Employee = require('../models/employee');

//CRUD
var CEmployee = require('../models/c_employee');
var UEmployee = require('../models/u_employee');
var DEmployee = require('../models/d_employee');
var jwt = require('../services/jwt');

var employeeController = {};


//CREATE A NEW EMPLOYEE
employeeController.createEmployee = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICIO'});

  } else {
    if (req.headers.role === 'ROLE_ADMIN') {
      var mannagerId = req.params.m_id;

      var employee = new Employee();
      var params = req.body;

      employee.name = params.name;
      employee.surname = params.surname;
      employee.email = params.email.toLowerCase();
      employee.username = params.username;
      employee.role = 'ROLE_EMPLOYEE';
      employee.image = 'null';
      employee.status = 'ACTIVE_EMPLOYEE';

      if (params.password) {
        //Encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err, hash){
          employee.password = hash;
          if (employee.name != null && employee.surname != null && employee.email != null) {

            //Guarar usuario en BD
            employee.save((err, employeeStored) => {
              if (err) {
                res.status(500).send({message: 'ERROR AL GUARDAR EMPLEADO'});

              }  else {
                if (!employeeStored) {
                  res.status(404).send({message: 'NO SE HA REGISTRADO AL EMPLEADO'});

                } else {
                  var c_employee = new CEmployee();
                  c_employee.date = new Date();
                  //c_employee.mannager = mannagerId;
                  c_employee.employee = employeeStored._id;
                  c_employee.mannager = req.params.m_id;

                  //Guarar registro de mng en BD
                  c_employee.save((err, cemployeeStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO EMPLEADO'});

                    } else {
                      if (!cemployeeStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO EMPLEADO'});

                      } else {
                        res.status(200).send({mng: employeeStored});
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
    } else {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    }
  }
}



//LOGIN AS AN EMPLOYEE
employeeController.loginEmployee = (req, res) => {

  var params = req.body;
  var email = params.email;
  var password = params.password;

  Employee.findOne({email: email.toLowerCase()}, (err, employee) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (!employee) {
        res.status(404).send({message: 'EL EMPLEADO NO EXISTE'});

      } else {
        //Comprobar contraseña
        bcrypt.compare(password, employee.password, (err, check) => {
          if (check) {
            //Devolver los datos del usuario logeado
            if (params.gethash) { //Generar token con objeto del usuario
                //devolver token de jwt
                res.status(200).send({
                  token: jwt.createToken(employee)
                });
            }
            else {
              res.status(200).send({employee});
            }
          }
          else {
            res.status(404).send({message: 'EL EMPLEADO NO HA PODIDO LOGUEARSE'});
          }
        });
      }
    }
  });
}



//READ EMPLOYEE
employeeController.readEmployee = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION_'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
        var employeeId = req.params.id;

        Employee.findById(employeeId, (err, employee) => {
          if (err) {
            res.status(500).send({message: 'ERROR EN LA PETICION'});

          } else {
            if (!employee) {
              res.status(404).send({message: 'EL CLIENTE NO EXISTE'});

            } else {
              res.status(200).send({employee: employee});
            }
          }
        });
    }
  }
}


//READ EMPLOYEES
employeeController.readEmployees = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      if (req.params.page) {
        var page = req.params.page;
      } else {
        var page = 1;
      }
      var itemsPerPage = 3;

      Employee.find({status: 'ACTIVE_EMPLOYEE'}).sort('name').paginate(page, itemsPerPage, (err, employees, total) => {
        if (err) {
          res.status(500).send({message: 'ERROR EN LA PETICION'});

        } else {
          if (employees) {
            return res.status(500).send({
              total_items: total,
              employees: employees
            });
          } else {
            res.status(404).send({message: 'NO HAY ARTISTAS'});
          }
        }
      });
    }
  }
}



//UPDATE CLIENT
employeeController.updateEmployee = (req, res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var employeeId = req.params.id;
      var update = req.body;

      Employee.findByIdAndUpdate(employeeId, update, (err, employeeUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar empleado'});

        } else {
          if (!employeeUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar al empleado'});
          } else {

            if (!req.params.m_id) {
              var mannagerId = null;
            } else {
              var mannagerId = req.params.m_id;
            }

            var u_employee = new UEmployee();
            u_employee.date = new Date();
            u_employee.before = employeeUpdated;
            u_employee.employee = employeeUpdated._id;


            Employee.findOne({_id: employeeId}, (err, upEmployee) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!upEmployee) {
                  res.status(404).send({message: 'EL EMPLEADO NO EXISTE'});

                } else {
                  u_employee.after = upEmployee;

                  //Guarar registro de cliente borrado en BD
                  u_employee.save((err, uemployeeStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE CLIENTE ACTUALIZADO'});

                    } else {
                      if (!uemployeeStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO LA ACTUALIZACION DEL CLIENTE'});

                      } else {
                        //RETURN UPDATED EMPLOYEE
                        res.status(200).send({upEmployee});
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



//DELETE CLIENT
employeeController.deleteEmployee = (req,res) => {

  if (!req.headers.role) {
    res.status(500).send({message: 'ERROR EN LA PETICION'});

  } else {
    if (req.headers.role != 'ROLE_ADMIN') {
      res.status(500).send({message: 'ERROR EN LA PETICION'});

    } else {
      var employeeId = req.params.id;
      var update = {status: 'INACTIVE_EMPLOYEE'};

      Employee.findByIdAndUpdate(employeeId, update, (err, employeeIdUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al eliminar empleado'});

        } else {
          if (!employeeIdUpdated) {
            res.status(404).send({message: 'No se ha podido eliminar al cliente'});

          } else {
            var d_employee = new DEmployee();
            d_employee.date = new Date();
            d_employee.employee = employeeId;
            d_employee.mannager = req.params.m_id;

            Employee.findOne({_id: employeeId}, (err, delEmployee) => {
              if (err) {
                res.status(500).send({message: 'ERROR EN LA PETICION'});

              } else {
                if (!delEmployee) {
                  res.status(404).send({message: 'EL EMPLEADO NO EXISTE'});

                } else {
                  d_employee.client = delEmployee;

                  //Guarar registro de empleado eliminado en BD
                  d_employee.save((err, demployeeStored) => {
                    if (err) {
                      res.status(500).send({message: 'ERROR AL GUARDAR REGISTRO DE EMPLEADO INACTIVO'});

                    } else {
                      if (!demployeeStored) {
                        res.status(404).send({message: 'NO SE HA REGISTRADO DEL EMPLEADO INACTIVO'});

                      } else {
                        res.status(200).send({delEmployee});
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


//UPLOAD EMPLOYEE IMAGE
employeeController.uploadImage = (req, res) => {

  var employeeId = req.params.id;
  var file_name = 'null';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Employee.findByIdAndUpdate(employeeId, {image: file_name}, (err, employeeUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al subir imagen del empleado'});

        } else {
          if (!employeeUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar al empleado'});

          } else {
            res.status(200).send({image: file_name, employee: employeeUpdated});
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



//GET EMPLOYEE IMAGE
employeeController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/employees/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));

    } else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}

module.exports = employeeController
