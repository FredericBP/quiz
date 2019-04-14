'use strict';

window.addEventListener('DOMContentLoaded', function() {
  angular.module('moduleGlobal', [])
  .factory('serviceStatutPages', [function() {
    return {
      statutDesPages: {
        pageAccueil: true,
        pageChoixTheme: false,
        pageConfigurationJoueur: false,
        pageMatchmaking: false,
        pageQuiz: false,
        pageResultats: false,
        pageScoresDesJoueurs: false,
        pageCredits: false
      },
      menuInGame: {
        ouvert: 'ferme',
        icone: 'fas fa-bars'
      }
    }
  }])
  .factory('serviceJoueurs', [function() {
    return {
      joueur: joueur,
      joueurAdverse: joueurAdverse
    }
  }])
  .factory('serviceQuiz', [function() {
    return {
      nombreDeJoueurs: quiz.nombreDeJoueurs,
      themeChoisi: quiz.themeChoisi,
      progressionJoueur: {
        question1: true,
        question2: false,
        question3: false,
        question4: false,
        question5: false,
        question6: false,
        question7: false,
        question8: false,
        question9: false,
        question10: false
      },
      quiz: quiz.quiz
    }
  }])
  .factory('serviceScore', [function() {
    return {
      scoreDesJoueurs: scoreJoueurs
    }
  }])
  .controller('ControllerAffichagePages', ['serviceStatutPages', function(donneesServiceStatutPages) {
    this.statutPages = donneesServiceStatutPages.statutDesPages;
    this.afficherPage = function(page, nombreDeJoueurs) {
      this.statutPages.pageAccueil = false;
      this.statutPages.pageChoixTheme = false;
      this.statutPages.pageConfigurationJoueur = false;
      this.statutPages.pageMatchmaking = false;
      this.statutPages.pageQuiz = false;
      this.statutPages.pageResultats = false;
      this.statutPages.pageScoresDesJoueurs = false;
      this.statutPages.pageCredits = false;
      this.statutPages[page] = true;
      this.statutMenuInGame = 'ferme';
      this.statutBoutonMenuInGame = 'fas fa-bars';
      quiz.nombreDeJoueurs = nombreDeJoueurs;
    }
    this.statutMenuInGame = donneesServiceStatutPages.menuInGame.ouvert;
    this.statutBoutonMenuInGame = donneesServiceStatutPages.menuInGame.icone;
    this.ouvrirMenuInGame = function() {
      if (this.statutMenuInGame === 'ferme') {
        this.statutMenuInGame = 'ouvert';
        this.statutBoutonMenuInGame = 'fas fa-times';
      } else {
        this.statutMenuInGame = 'ferme';
        this.statutBoutonMenuInGame = 'fas fa-bars';
      }
    }
  }])
  .controller('ControllerChoixTheme', ['serviceStatutPages', 'serviceQuiz', function(donneesServiceStatutPages, donneesServiceQuiz) {
    this.choisirTheme = function(theme) {
      quiz.themeChoisi = theme;
      // fonctionSocketIo.emit('choixTheme', quiz);
      donneesServiceStatutPages.statutDesPages.pageAccueil = false;
      donneesServiceStatutPages.statutDesPages.pageChoixTheme = false;
      donneesServiceStatutPages.statutDesPages.pageMatchmaking = false;
      donneesServiceStatutPages.statutDesPages.pageQuiz = false;
      donneesServiceStatutPages.statutDesPages.pageScoresDesJoueurs = false;
      donneesServiceStatutPages.statutDesPages.pageCredits = false;
      donneesServiceStatutPages.statutDesPages.pageConfigurationJoueur = true;
    }
  }])
  .controller('ControllerConfigurationJoueur', ['serviceStatutPages', function(donneesServiceStatutPages) {
    this.pseudo = joueur.pseudo;
    this.avatar = joueur.avatar;
    this.validerConfigurationJoueur = function(valide) {
      if (valide) {
        joueur.pseudo = this.pseudo;
        joueur.avatar = this.avatar;
        donneesServiceStatutPages.statutDesPages.pageAccueil = false;
        donneesServiceStatutPages.statutDesPages.pageChoixTheme = false;
        donneesServiceStatutPages.statutDesPages.pageConfigurationJoueur = false;
        donneesServiceStatutPages.statutDesPages.pageMatchmaking = false;
        donneesServiceStatutPages.statutDesPages.pageQuiz = false;
        donneesServiceStatutPages.statutDesPages.pageScoresDesJoueurs = false;
        donneesServiceStatutPages.statutDesPages.pageCredits = false;
        if (quiz.nombreDeJoueurs === 2) {
          donneesServiceStatutPages.statutDesPages.pageMatchmaking = false;
          donneesServiceStatutPages.statutDesPages.pageQuiz = true;
          
          // MATCHMAKING POUR GERER L'ATTENTE JUSQU'A L'ARRIVEE D'UN AUTRE JOUEUR
          // donneesServiceStatutPages.statutDesPages.pageMatchmaking = true;
          // let idSetIntervalMatchmaking = setInterval(function() {
          //   fonctionSocketIo.emit('joueur', joueur);
          //   if (!joueurAdverse.pseudo) {
          //     console.log(`Recherche d'un adversaire en cours`);
          //   } else {
          //     clearInterval(idSetIntervalMatchmaking);
          //     console.log(`Arrêt du setInterval`);
          //     donneesServiceStatutPages.statutDesPages.pageMatchmaking = false;
          //     donneesServiceStatutPages.statutDesPages.pageQuiz = true;
          //   }
          // }, 500);
        } else {
          // AFFICHAGE DIRECT DU QUIZ POUR UN JOUEUR
          donneesServiceStatutPages.statutDesPages.pageQuiz = true;
        }
      }
    }
  }])
  .controller('ControllerQuiz', ['serviceStatutPages', 'serviceJoueurs', 'serviceQuiz', function(donneesServiceStatutPages, donneesServiceJoueurs, donneesServiceQuiz) {
    fonctionSocketIo.on('joueurAdverse');
    this.joueur = joueur;
    this.joueurAdverse = joueurAdverse;
    this.themeChoisi = quiz.themeChoisi;
    this.quiz = donneesServiceQuiz.quiz;
    this.progressionJoueur = donneesServiceQuiz.progressionJoueur;
    this.suivreLaProgressionJoueur = function(numeroQuestion) {
      fonctionSocketIo.emit('joueur', joueur);
      switch (donneesServiceJoueurs.joueur.progression['reponse' + numeroQuestion]) {
        case undefined:
          return 'fas fa-circle'
          break;
        case true:
          return 'fas fa-check-circle'
          break;
        case false:
          return 'fas fa-times-circle'
          break;
      }
    }
    this.suivreLaProgressionJoueurAdverse = function(numeroQuestion) {
      fonctionSocketIo.emit('joueur', joueur);
      switch (donneesServiceJoueurs.joueurAdverse.progression['reponse' + numeroQuestion]) {
        case undefined:
          return 'fas fa-circle'
          break;
        case true:
          return 'fas fa-check-circle'
          break;
        case false:
          return 'fas fa-times-circle'
          break;
      }
    }
    this.validerReponse = function(numeroQuestion, numeroReponse) {
      fonctionSocketIo.emit('joueur', joueur);
      if (numeroReponse === donneesServiceQuiz.quiz[numeroQuestion - 1].reponseValide) {
        joueur.progression['reponse' + numeroQuestion] = true;
        joueur.score += 1000;
      } else {
        joueur.progression['reponse' + numeroQuestion] = false;
      }
      donneesServiceQuiz.progressionJoueur['question' + numeroQuestion] = false;
      donneesServiceQuiz.progressionJoueur['question' + (numeroQuestion + 1)] = true;
      donneesServiceJoueurs.joueur.progression.questionEnCours++;
      fonctionSocketIo.emit('joueur', joueur);
      if (10 === numeroQuestion) {
        fonctionSocketIo.emit('enregistrementScore', joueur);
        donneesServiceStatutPages.statutDesPages.pageAccueil = false;
        donneesServiceStatutPages.statutDesPages.pageChoixTheme = false;
        donneesServiceStatutPages.statutDesPages.pageConfigurationJoueur = false;
        donneesServiceStatutPages.statutDesPages.pageMatchmaking = false;
        donneesServiceStatutPages.statutDesPages.pageQuiz = false;
        donneesServiceStatutPages.statutDesPages.pageCredits = false;
        donneesServiceStatutPages.statutDesPages.pageScoresDesJoueurs = true;
      }
    }
  }])
  .controller('ControllerScoreDesJoueurs', ['serviceStatutPages', 'serviceScore', function(donneesServiceStatutPages, donneesServiceScore) {
    this.scoreDesJoueurs = donneesServiceScore.scoreDesJoueurs;
  }]);
  angular.bootstrap(window.document, ['moduleGlobal'], { strictDi: true });
});