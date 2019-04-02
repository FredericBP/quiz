'use strict';
// INITIALISATION DES MODULES
const chalk = require('chalk');
const modulePath = require('path');
const moduleFileSystem = require('fs');
const moduleHTTP = require('http');
const serveurHTTP = moduleHTTP.createServer();

// GESTION DES REQUETES HTTP
serveurHTTP.on('request', function(requeteHTTP, reponseHTTP) {
  console.log(chalk.blue(`Connexion le : ` + new Date()));

  // GESTION DE LA RESSOURCE
  let ressource = requeteHTTP.url;
  if ( '/' === requeteHTTP.url ) {
    ressource = '/index.html';
  }
  console.log(chalk.grey(`Fichier concerné : ` + ressource));

  // GESTION DU CHEMIN LOCAL DES FICHIERS
  let cheminLocalDuFichier = modulePath.normalize(__dirname + ressource);

  // LECTURE DU FICHIER A RENVOYER EN REPONSE HTTP
  moduleFileSystem.readFile(cheminLocalDuFichier, function(erreur, contenu) {
    // DEFINITION DU CODE STATUT ET DU CORPS DE LA REPONSE
    let codeStatut;
    let corpsReponse;
    if (erreur) {
      codeStatut = 500;
      corpsReponse = `<h1>Erreur 500</h1>`;
      corpsReponse = Buffer.from(corpsReponse);
    } else {
      codeStatut = 200;
      corpsReponse = contenu;
    }

    // VERIFICATION DU TYPEMIME DU FICHIER DEMANDE
    let typesMimes = {
      '.txt': 'text/plain;charset=utf8',
      '.html': 'text/html',
      '.css': 'text/css',
      '.map': 'application/json',
      '.js': 'application/javascript',
      '.php': 'text/html',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.pdf': 'application/pdf',
      '.ttf': 'font/ttf',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'application/ogg'
    }
    let typeMime;
    let extensionDuFichier = modulePath.extname(cheminLocalDuFichier);
    if (typesMimes[extensionDuFichier]) {
      typeMime = typesMimes[extensionDuFichier];
    } else {
      typeMime = typesMimes['.html'];
    }

    // DEFINITION DE L'EN-TETE DE LA REPONSE HTTP
    reponseHTTP.writeHead(codeStatut, {
      'Content-Length': corpsReponse.length,
      'Content-Type': typeMime
    });

    // DEFINITION DU CORPS DE LA REPONSE HTTP
    reponseHTTP.write(corpsReponse, function() {
      reponseHTTP.end();
    });
  });
});

// GESTION DES REQUETES SOCKET.IO
const socketIo = require('socket.io');
const io = socketIo(serveurHTTP);


io.on('connection', function(socket) {
  console.log(chalk.yellow(`Connexion WebSocket établie avec : ` + socket.id));
  
  // DONNEES A RENVOYER
  let lotrQuiz = require('./db/lotr.json');
  let joueur;
  let joueurAdverse;
  let scoreJoueurs = [];

  // GESTION DES DONNEES LIEES AUX JOUEURS
  socket.on('joueur', function(data) {
    joueurAdverse = data;
    socket.broadcast.emit('joueurAdverse', joueurAdverse);
  });

  socket.on('choixTheme', function(data) {
    socket.broadcast.emit('choixTheme', {message: 'Renvoi du thème ok'});
  });
  
  socket.emit('enregistrementScore', scoreJoueurs);
  socket.on('enregistrementScore', function(data) {
    scoreJoueurs.push({
      pseudo: data.pseudo,
      score: data.score,
      date: new Date()
    });
    socket.emit('enregistrementScore', scoreJoueurs);
  });

  socket.on('disconnect', function() {
    console.log(chalk.magenta(`Déconnexion WebSocket avec : ` + socket.id));
  });
});

// ATTRIBUTION DU PORT D'ECOUTE
const port = 5000;
serveurHTTP.listen(port, function(erreur) {
  if (erreur) {
    console.log(chalk.red(`Impossible de démarrer le serveur sur le port ` + port));
  } else {
    console.log(chalk.green(`Le serveur est à l'écoute sur le port ` + port));
  }
});