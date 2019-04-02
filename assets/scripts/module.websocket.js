'use strict';

var fonctionSocketIo = {};

window.addEventListener('DOMContentLoaded', function() {
  let protocol = 'http://';
  let hostname = 'localhost';
  let port = ':5000';
  var socket = io(protocol + hostname + port);
  console.log(`Connexion WebSocket établie depuis le client`);

  fonctionSocketIo.on = (evenement) => {
    socket.on(evenement, function(data) {
      console.log(data);
    });
  }
  
  fonctionSocketIo.emit = (evenement, data) => {
    socket.emit(evenement, data);
  }

  socket.on('joueurAdverse', function(data) {
    joueurAdverse.pseudo = data.pseudo;
    joueurAdverse.avatar = data.avatar;
    joueurAdverse.score = data.score;
    joueurAdverse.progression = data.progression;
  });

  socket.on('enregistrementScore', function(data) {
    scoreJoueurs.push(data);
  });
});