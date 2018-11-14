//CONTROLADOR ARTIST
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var artistController = {};

artistController.getArtist = (req, res) => {
var artistId = req.params.id;
Artist.findById(artistId, (err, artist) => {
  if (err) {
    res.status(500).send({message: 'ERROR EN LA PETICION'});
  } else {
    if (!artist) {
      res.status(404).send({message: 'EL ARTISTA NO EXISTE'});
    } else {
      res.status(200).send({artist: artist});

    }
  }
});
}


artistController.getArtists = (req,res) => {

  if (req.params.page) {
    var page = req.params.page;
  } else {
    var page = 1;
  }
  var itemsPerPage = 3;

  Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (artists) {
        return res.status(500).send({
          total_items: total,
          artists: artists
        });
      } else {
        res.status(404).send({message: 'NO HAY ARTISTAS'});
      }
    }
  });

}

artistController.saveArtist = (req, res) => {
  var artist = new Artist();

  var params = req.body;
  artist.name = params.name;
  artist.description = params.description;
  artist.image = 'null';

  artist.save((err, artistStored) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL GUARDAR ARTISTA'});
    } else {
      if (!artistStored) {
        res.status(404).send({message: 'EL ARTISTA NO HA SIDO GUARDADO'});
      } else {
        res.status(200).send({artist: artistStored});
      }
    }
  });
}

artistController.updateArtist = (req, res) => {
  var artistId = req.params.id;
  var update = req.body;

  Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL ACTUALIZAR ARTISTA'});
    } else {
      if (!artistUpdated) {
        res.status(404).send({message: 'EL ARTISTA NO HA SIDO ACTUALIZADO'});
      } else {
        res.status(200).send({artist: artistUpdated});
      }
    }
  });
}

artistController.deleteArtist = (req,res) => {
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL ELIMINAR ARTISTA'});
    } else {
      if (!artistRemoved) {
        res.status(404).send({message: 'EL ARTISTA NO HA SIDO ELIMINADO'});
      } else {
        Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                    res.status(404).send({message: 'LA CANCION DEL ALBUM DEL ARTISTA NO HA SIDO ELIMINADA'});
                  } else {
                    res.status(200).send({artistRemoved});
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

artistController.uploadImage = (req, res) => {
  var artistId = req.params.id;
  var file_name = 'No subido ...';

  if (req.files) {
    var file_path = req.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
      Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar artista'});
        } else {
          if (!artistUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar el artista'});
          } else {
            res.status(200).send({artist: artistUpdated});
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

artistController.getImageFile = (req, res) => {
  var imageFile = req.params.imageFile;
  var path_file = './uploads/artists/' + imageFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
}

module.exports = artistController;
