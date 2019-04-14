'use strict';

var fonctionSocketIo = {};

window.addEventListener('DOMContentLoaded', function() {
  var socket = io();
  console.log(`Connexion WebSocket établie depuis le client`);

  fonctionSocketIo.on = (evenement) => {
    socket.on(evenement, function(data) {
      if (evenement === 'joueurAdverse') {
        joueurAdverse.pseudo = data.pseudo;
        joueurAdverse.avatar = data.avatar;
        joueurAdverse.score = data.score;
        joueurAdverse.progression = data.progression;
      }
    });
  }
  
  fonctionSocketIo.emit = (evenement, data) => {
    socket.emit(evenement, data);
  }

  socket.on('listeScores', function(data) {
    scoreJoueurs = JSON.parse(data);
  });

  socket.on('joueurAdverse', function(data) {
    joueurAdverse.pseudo = data.pseudo;
    joueurAdverse.avatar = data.avatar;
    joueurAdverse.score = data.score;
    joueurAdverse.progression = data.progression;
  });
});