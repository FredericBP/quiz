'use strict';

// INITIALISATION DES MODULES
const chalk = require('chalk');
const modulePath = require('path');
const moduleFileSystem = require('fs');
const moduleHTTP = require('http');
const serveurHTTP = moduleHTTP.createServer();

// INITIALISATION DE LA BASE DE DONNEES
const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'quiz';
// const bdd = require('./db/db');

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
const io = socketIo(serveurHTTP).listen(3000);

io.on('connection', function(socket) {
  console.log(chalk.yellow(`Connexion WebSocket établie avec : ` + socket.id));
  
  // DONNEES A RENVOYER
  const collectionScores = 'scores';
  const collectionQuiz = 'lotr';
  let joueurAdverse;
  let scoreJoueurs = [];
  let quizSeigneurDesAnneaux = [];
  
  // RECUPERATION DU QUIZ DU SEIGNEUR DES ANNEAUX DANS LA BASE DE DONNEES
  mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function(erreur, client) {
    if (erreur) {
      console.log(chalk.red(`Impossible de se connecter à MongoDB`));
    } else {
      let db = client.db(dbName);
      db.collection(collectionQuiz, {strict: true}, function(erreur, collection) {
        if (erreur) {
          console.log(chalk.red(`Impossible de se connecter à la collection ` + collectionQuiz));
          client.close();
        } else {
          let cursor = collection.find();
          cursor.toArray(function(erreur, documents) {
            if (erreur) {
              console.log(chalk.red(`Impossible de parcourir la collection ` + collectionQuiz));
            } else {
              for (let i = 0; i < documents.length; i++) {
                quizSeigneurDesAnneaux.push(documents[i]);
              }
              socket.emit('quizSeigneurDesAnneaux', JSON.stringify(quizSeigneurDesAnneaux));
            }
            client.close();
          });
        }
      });
    }
  });

  // RECUPERATION DES SCORES EXISTANTS DANS LA BASE DE DONNEES
  mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function(erreur, client) {
    if (erreur) {
      console.log(chalk.red(`Impossible de se connecter à MongoDB`));
    } else {
      let db = client.db(dbName);
      db.collection(collectionScores, {strict: true}, function(erreur, collection) {
        if (erreur) {
          console.log(chalk.red(`Impossible de se connecter à la collection ` + collectionScores));
          client.close();
        } else {
          let cursor = collection.find();
          cursor.toArray(function(erreur, documents) {
            if (erreur) {
              console.log(chalk.red(`Impossible de parcourir la collection ` + collectionScores));
            } else {
              for (let i = 0; i < documents.length; i++) {
                scoreJoueurs.push(documents[i]);
              }
              socket.emit('listeScores', JSON.stringify(scoreJoueurs));
            }
            client.close();
          });
        }
      });
    }
  });
  
  // ENREGISTREMENT DU SCORE DU JOUEUR DANS LA BASE DE DONNEES
  socket.on('enregistrementScore', function(data) {
    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, function(erreur, client) {
      if (erreur) {
        console.log(chalk.red(`Impossible de se connecter à MongoDB`));
      } else {
        let db = client.db(dbName);

        // INSERTION DU SCORE DANS LA BASE DE DONNEES
        db.collection(collectionScores).insertOne({
          pseudo: data.pseudo,
          score: data.score,
          date: new Date()
        }, function(erreur, reponse) {
          if (erreur) {
            console.log(chalk.red(`Impossible d'enregistrer le score dans la base de données`));
          }
        });

        // AJOUT ET ENVOI DU SCORE DANS UN OBJET VERS LE CLIENT
        db.collection(collectionScores, {strict: true}, function(erreur, collection) {
          if (erreur) {
            console.log(chalk.red(`Impossible de se connecter à la collection ` + collectionScores));
            client.close();
          } else {
            let cursorFind = collection.find();
            cursorFind.toArray(function(erreur, documents) {
              if (erreur) {
                console.log(chalk.red(`Impossible de parcourir la collection ` + collectionScores));
              } else {
                scoreJoueurs.push(documents[documents.length - 1]);
                socket.emit('listeScores', JSON.stringify(scoreJoueurs));
              }
              client.close();
            });
          }
        });
      }
    });
  });

  // GESTION DES DONNEES LIEES AUX JOUEURS
  socket.on('joueur', function(data) {
    joueurAdverse = data;
    socket.broadcast.emit('joueurAdverse', joueurAdverse);
  });

  // GESTION DE LA DECONNEXION D'UN CLIENT
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