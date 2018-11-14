//CONTROLADOR ARTIST
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var albumController = {};

//GET AN ALBUM WITH A GIVEN ID
albumController.getAlbum = (req, res) => {
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!album) {
        res.status(404).send({message: 'EL ALBUM NO EXISTE'});
      } else {
        res.status(200).send({album: album});
      }
    }
  });
}


//GET ALBUMS GIT AN ARTIST ID
albumController.getAlbums = (req, res) => {
  var artistId = req.params.artist;

  if (!artistId) { //Sacar todos los albums de la base de datos
    var find = Album.find({}).sort('title');
  } else { //Saca los albums de un artista en concreto de la bd
    var find = Album.find({artist: artistId}).sort('year');
  }

  find.populate({path: 'artist'}).exec((err, albums) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!albums) {
        res.status(404).send({message: 'NO HAY ALBUMS'});
      } else {
        res.status(200).send({albums});
      }
    }
  });
}



//CREATE A NEW ALBUM
albumController.saveAlbum = (req, res) => {
  var album = new Album();

  var params = req.body;
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = 'null';
  album.artist = params.artist;

  album.save((err, albumStored) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL GUARDAR ALBUM'});
    } else {
      if (!albumStored) {
        res.status(404).send({message: 'EL ALBUM NO HA SIDO GUARDADO'});
      } else {
        res.status(200).send({album: albumStored});
      }
    }
  });
}


//UPDATE ALBUM
albumController.updateAlbum = (req, res) => {
  var albumId = req.params.id;
  var update = req.body;

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL ACTUALIZAR ALBUM'});
    } else {
      if (!albumUpdated) {
        res.status(404).send({message: 'EL ALBUM NO HA SIDO ACTUALIZADO'});
      } else {
        res.status(200).send({album: albumUpdated});
      }
    }
  });
}

albumController.deleteAlbum = (req,res) => {
  var albumId = req.params.id;

  Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL ELIMINAR ALBUM DEL ARTISTA'});
    } else {
      if (!albumRemoved) {
        res.status(404).send({message: 'EL ALBUM DEL ARTISTA NO HA SIDO ELIMINADO'});
      } else {
        Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
          if (err) {
            res.status(500).send({message: 'ERROR AL ELIMINAR LA CANCION DEL ALBUM DEL ARTISTA'});
          } else {
            if (!songRemoved) {
              res.status(404).send({message: 'LA CANCION DEL ALBUM NO HA SIDO ELIMINADA'});
            } else {
              res.status(200).send({album: albumRemoved});
            }
          }
        });
      }
    }
  });
}

albumController.uploadImage = (req, res) => {
  var albumId = req.params.id;
  var file_name = 'No subido ...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar album'});
        } else {
          if (!albumUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el album'});
          } else {
            res.status(200).send({album: albumUpdated});
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

albumController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/albums/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}

module.exports = albumController;
