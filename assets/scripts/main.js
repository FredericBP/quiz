'use strict';

var joueur = {
  pseudo: undefined,
  avatar: undefined,
  score: 0,
  progression: {
    questionEnCours: 1,
    reponse1: undefined,
    reponse2: undefined,
    reponse3: undefined,
    reponse4: undefined,
    reponse5: undefined,
    reponse6: undefined,
    reponse7: undefined,
    reponse8: undefined,
    reponse9: undefined,
    reponse10: undefined
  }
}

var joueurAdverse = {
  pseudo: undefined,
  avatar: undefined,
  score: 0,
  progression: {
    questionEnCours: 1,
    reponse1: undefined,
    reponse2: undefined,
    reponse3: undefined,
    reponse4: undefined,
    reponse5: undefined,
    reponse6: undefined,
    reponse7: undefined,
    reponse8: undefined,
    reponse9: undefined,
    reponse10: undefined
  }
}

var quiz = {
  nombreDeJoueurs: undefined,
  themeChoisi: undefined,
  quiz: [
    {
      "id": 1,
      "question": "Quel est le vrai nom de Gandalf ?",
      "reponse1": "Manwë",
      "reponse2": "Olórin",
      "reponse3": "Ulmo",
      "reponse4": "Curumo",
      "reponse5": "Mandos",
      "reponseValide": 2
    },
    {
      "id": 2,
      "question": "Qui est le plus jeune parmis les hobbits ?",
      "reponse1": "Frodon",
      "reponse2": "Sam",
      "reponse3": "Bilbo",
      "reponse4": "Merry",
      "reponse5": "Pippin",
      "reponseValide": 5
    },
    {
      "id": 3,
      "question": "Quel est le vrai nom du ranger Grand-Pas ?",
      "reponse1": "Faramir",
      "reponse2": "Elrond",
      "reponse3": "Aragorn",
      "reponse4": "Boromir",
      "reponse5": "Sam",
      "reponseValide": 3
    },
    {
      "id": 4,
      "question": "Où faut-il emmener l'anneau ?",
      "reponse1": "Fangorn",
      "reponse2": "La Comté",
      "reponse3": "Les Havres Gris",
      "reponse4": "Mordor",
      "reponse5": "Gondor",
      "reponseValide": 4
    },
    {
      "id": 5,
      "question": "Où habite Frodon ?",
      "reponse1": "Mordor",
      "reponse2": "Rohan",
      "reponse3": "Gondor",
      "reponse4": "Lorien",
      "reponse5": "La Comté",
      "reponseValide": 5
    },
    {
      "id": 6,
      "question": "De quelle race Legolas est-il issu ?",
      "reponse1": "Nain",
      "reponse2": "Elfe",
      "reponse3": "Humain",
      "reponse4": "Goblin",
      "reponse5": "Troll",
      "reponseValide": 2
    },
    {
      "id": 7,
      "question": "Comment s'appelle le maître de Sauron ?",
      "reponse1": "Frodon",
      "reponse2": "Feanor",
      "reponse3": "Morgoth",
      "reponse4": "Elendil",
      "reponse5": "Guldun",
      "reponseValide": 3
    },
    {
      "id": 8,
      "question": "Quel est le nom du roi du Rohan ?",
      "reponse1": "Theoden",
      "reponse2": "Aragorn",
      "reponse3": "Faramir",
      "reponse4": "Celeborn",
      "reponse5": "Elrond",
      "reponseValide": 1
    },
    {
      "id": 9,
      "question": "Qui tue Saroumane ?",
      "reponse1": "Frodon",
      "reponse2": "Gandalf",
      "reponse3": "Legolas",
      "reponse4": "Grima",
      "reponse5": "Sauron",
      "reponseValide": 4
    },
    {
      "id": 10,
      "question": "Combien y a-t-il d'anneaux ?",
      "reponse1": "1",
      "reponse2": "9",
      "reponse3": "10",
      "reponse4": "20",
      "reponse5": "31",
      "reponseValide": 4
    }
  ]
}

var scoreJoueurs = [];

window.addEventListener('DOMContentLoaded', function() {
  var interfaceDuJeu = {
    largeurBoutonMenuPrincipal: 1000,
    hauteurBoutonMenuPrincipal: 200,
    couleurBoutonMenuPrincipal: '#000',
    creationBoutonMenuPrincipal: function(numeroBoutonMenuPrincipal) {
      // DEFINITION DU NOM DE L'ATTRIBUT ID
      var idBoutonMenuPrincipal = 'boutonMenuPrincipal' + numeroBoutonMenuPrincipal;
  
      // DESSIN DU BOUTON DANS LE CANVAS
      var ctx = document.getElementById('boutonMenuPrincipal1').getContext('2d');
      ctx.fillStyle = '#f00';
      ctx.strokeStyle = '#0f0';
      
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(0,0);
      ctx.lineTo(50, 0);
      ctx.lineTo(50, 50);
      ctx.lineTo(0, 50);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }
  // gameInterface.creationBoutonMenuPrincipal(1);
}, false);