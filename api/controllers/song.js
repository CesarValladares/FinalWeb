//CONTROLADOR ARTIST
var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var songController = {};

//GET AN ALBUM WITH A GIVEN ID
songController.getSong = (req, res) => {

  var songId = req.params.id;

  Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!song) {
        res.status(404).send({message: 'LA CANCION NO EXISTE'});
      } else {
        res.status(200).send({song: song});
      }
    }
  });
}

//GET SONGS OF AN ALBUM
songController.getSongs = (req, res) => {
  var albumId = req.params.album;

  if (!albumId) { //Sacar todas las canciones de la BD
    var find = Song.find({}).sort('number');
  } else { //Saca las canciones del album
    var find = Song.find({album: albumId}).sort('number');
  }

  find.populate({path: 'album'}).exec((err, songs) => {
    if (err) {
      res.status(500).send({message: 'ERROR EN LA PETICION'});
    } else {
      if (!songs) {
        res.status(404).send({message: 'NO HAY CANCIONES'});
      } else {
        res.status(200).send({songs});
      }
    }
  });
}

//CREATE A SONG IN AN ALBUM
songController.saveSong = (req, res) => {
  var song = new Song();

  var params = req.body;
  song.name = params.name;
  song.number = params.number;
  song.duration = params.duration;
  song.file = 'null';
  song.album = params.album;

  song.save((err, songStored) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL GUARDAR CANCIÓN'});
    } else {
      if (!songStored) {
        res.status(404).send({message: 'LA CANCION NO HA SIDO GUARDADA'});
      } else {
        res.status(200).send({song: songStored});
      }
    }
  });
}

//UPDATE ALBUM
songController.updateSong = (req, res) => {
  var songId = req.params.id;
  var update = req.body;

  Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL ACTUALIZAR CANCION'});
    } else {
      if (!songUpdated) {
        res.status(404).send({message: 'LA CANCIÓN NO HA SIDO ACTUALIZADA'});
      } else {
        res.status(200).send({song: songUpdated});
      }
    }
  });
}


//DELETE SONG
songController.deleteSong = (req,res) => {
  var songId = req.params.id;

  Song.findByIdAndDelete(songId, (err, songRemoved) => {
    if (err) {
      res.status(500).send({message: 'ERROR AL ELIMINAR LA CANCION DEL ALBUM DEL ARTISTA'});
    } else {
      if (!songRemoved) {
        res.status(404).send({message: 'LA CANCION DEL ALBUM NO HA SIDO ELIMINADA'});
      } else {
        res.status(200).send({song: songRemoved});
      }
    }
  });
}


songController.uploadSongFile = (req, res) => {
  var songId = req.params.id;
  var file_name = 'No subido ...';

  if (req.files) {
    var file_path = req.files.file.path;
    var file_split = file_path.split('/');
    var file_name = file_split[2];
    var ext_split = file_path.split('.');
    var file_ext = ext_split[1];

    if (file_ext == 'mp3' || file_ext == 'ogg') {
      Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
        if (err) {
          res.status(500).send({message: 'Error al actualizar cancion'});
        } else {
          if (!songUpdated) {
            res.status(404).send({message: 'No se ha podido actualizar la canción'});
          } else {
            res.status(200).send({song: songUpdated});
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

songController.getSongFile = (req, res) => {
  var songFile = req.params.songFile;
  var path_file = './uploads/songs/' + songFile;
  fs.exists(path_file, function(exists){
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({message: 'No existe la canción'});
    }
  });
}

module.exports = songController;
