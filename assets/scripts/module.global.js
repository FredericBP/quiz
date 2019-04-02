'use strict';
window.addEventListener('DOMContentLoaded', function() {
  angular.module('moduleGlobal', [])
  .factory('serviceStatutPages', [function() {
    return {
      statutDesPages: {
        pageAccueil: true,
        pageChoixTheme: false,
        pageConfigurationJoueur: false,
        pageQuiz: false,
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
      this.statutPages.pageQuiz = false;
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
      fonctionSocketIo.emit('choixTheme', quiz);
      if (donneesServiceQuiz.nombreDeJoueurs === 2) {
        fonctionSocketIo.on('joueurAdverse');
      }
      donneesServiceStatutPages.statutDesPages.pageAccueil = false;
      donneesServiceStatutPages.statutDesPages.pageChoixTheme = false;
      donneesServiceStatutPages.statutDesPages.pageQuiz = false;
      donneesServiceStatutPages.statutDesPages.pageScoresDesJoueurs = false;
      donneesServiceStatutPages.statutDesPages.pageCredits = false;
      donneesServiceStatutPages.statutDesPages.pageConfigurationJoueur = true;
    }
  }])
  .controller('ControllerConfigurationJoueur', ['serviceStatutPages', function(donneesServiceStatutPages) {
    this.pseudo = undefined;
    this.avatar = 'avatar' + Math.floor(Math.random() * 9);
    this.validerConfigurationJoueur = function(valide) {
      if (valide) {
        joueur.pseudo = this.pseudo;
        joueur.avatar = this.avatar;
        fonctionSocketIo.emit('joueur', joueur);
        donneesServiceStatutPages.statutDesPages.pageAccueil = false;
        donneesServiceStatutPages.statutDesPages.pageChoixTheme = false;
        donneesServiceStatutPages.statutDesPages.pageConfigurationJoueur = false;
        donneesServiceStatutPages.statutDesPages.pageScoresDesJoueurs = false;
        donneesServiceStatutPages.statutDesPages.pageCredits = false;
        donneesServiceStatutPages.statutDesPages.pageQuiz = true;
      }
    }
  }])
  .controller('ControllerQuiz', ['serviceStatutPages', 'serviceJoueurs', 'serviceQuiz', function(donneesServiceStatutPages, donneesServiceJoueurs, donneesServiceQuiz) {
    this.joueur = donneesServiceJoueurs.joueur;
    this.joueurAdverse = donneesServiceJoueurs.joueurAdverse;
    this.themeChoisi = donneesServiceQuiz.themeChoisi;
    this.quiz = donneesServiceQuiz.quiz;
    this.progressionJoueur = donneesServiceQuiz.progressionJoueur;
    this.suivreLaProgressionJoueur = function(numeroQuestion) {
      fonctionSocketIo.on('joueurAdverse');
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
        donneesServiceStatutPages.statutDesPages.pageQuiz = false;
        donneesServiceStatutPages.statutDesPages.pageQuizDeuxJoueur = false;
        donneesServiceStatutPages.statutDesPages.pageCredits = false;
        donneesServiceStatutPages.statutDesPages.pageScoresDesJoueurs = true;
      }
    }
  }])
  .controller('ControllerScoreDesJoueurs', ['serviceStatutPages', 'serviceScore', function(donneesServiceStatutPages, donneesServiceScore) {
    this.scoreDesJoueurs = donneesServiceScore;
  }]);
  angular.bootstrap(window.document, ['moduleGlobal'], { strictDi: true });
});