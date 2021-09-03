// noinspection JSCheckFunctionSignatures

const fs = require("fs");
module.exports = class Gestion {
  fs = '';
  constructor() {
  }

  // initialise le système fs
  addFS(fs_) {
    this.fs = fs_;
  }

  initFile(id, residence, res) {
    // informations nécessaires pour l'inscription
    const data = {
      "nom": "",
      "prenom": "",
      "chambre": ""
    }

    // tous les créneaux possibles
    const horaires = {
      '7H': data,
      '8H30': data,
      '10H': data,
      '11H30': data,
      '13H': data,
      '14H30': data,
      '16H': data,
      '17H30': data,
      '19H': data,
      '20H30': data};

    // tous les jours de la semaine
    const jours = {
      'dimanche1': horaires,
      'lundi': horaires,
      'mardi': horaires,
      'mercredi': horaires,
      'jeudi': horaires,
      'vendredi': horaires,
      'samedi': horaires,
      'dimanche2': horaires
    };

    // on écrit le fichier de planning avec ces données de base
    fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(jours, null, 2));

    // on initialise le système d'historique correspondant à ce planning
    this.initHistorique(id, residence);

    this.addListe(id, residence);

    // si la fonction a été appelé via requête http
    if (res !== undefined) res.status(200).send('ok');
  }

  // ajoute le planning à la liste de planning
  addListe(id, residence) {
    const liste = JSON.parse(fs.readFileSync('./listPlannings.json'));

    // on récupère l'index de la position de la résidence dans la liste
    let index = liste['residences'].findIndex(res => res.residence === residence);

    // si la résidence n'existe pas encore
    if (index === -1) {
      liste['residences'].push({
        'residence': residence,
        'name': residence,
        'liste': [id]
      });
    }
    else {
      // on vérifie que ce que l'on cherche à ajouter ne l'a pas déjà été
      if (liste['residences'][index]['liste'].find(res => res === id) === undefined) {
        liste['residences'][index]['liste'].push(id);
      }
    }

    // on réécrit le fichier
    fs.writeFileSync('./listPlannings.json', JSON.stringify(liste, null, 2));
  }

  // ajoute un créneau
  addCreneau(informations, res) {
    let id, nom, prenom, residence, chambre, jour, heure;

    // on récupère les informations dans la requête
    [id, residence, jour, heure, nom, prenom, chambre] = informations.split('+');

    // on vérifie que l'on a toutes les infos nécessaires
    if (id !== undefined && residence !== undefined && jour !== undefined && heure !== undefined && nom !== undefined && prenom !== undefined && chambre !== undefined) {
      // si le try passe, le fichier existe, sinon on le créé
      try {
        // on récupère le planning
        const planning = JSON.parse(fs.readFileSync('./plannings/' + residence + '/' + id + '.json'));

        // on vérifie qu'il n'y a pas déjà quelqu'un sur ce créneau
        if (planning[jour][heure].nom === '') {
          // on inscrit la personne
          planning[jour][heure].nom = nom;
          planning[jour][heure].prenom = prenom;
          planning[jour][heure].chambre = chambre;

          // on enregistre l'inscription
          this.fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

          // on ajoute l'inscription à l'historique
          this.addHistorique('Inscription sur le créneau', id, residence, nom, prenom, chambre, jour, heure);

          // on renvoi une réponse positive à l'inscription
          res.status(200).send('Inscription réussi');
        }
        else {
          // quelqu'un est déjà inscris, on envoi une réponse d'erreur
          res.status(404).send('Créneau déjà utilisé')
        }
      }
      catch (err) {
        // on initialise le fichier de planning
        this.initFile(residence, id);
        // on refait l'inscription
        this.addCreneau(informations, res);
      }
    }
    else {
      // il manque des informations, donc on renvoit une erreur
      res.status(404).send('Erreur dans les informations fournies');
    }
  }

  // suppression d'un créneau déjà existant
  removeCreneau(informations, res) {
    let id, nom, prenom, residence, chambre, jour, heure;

    // on récupère les informations dans la requête
    [id, residence, jour, heure, nom, prenom, chambre] = informations.split('+');

    // on vérifie que l'on a toutes les infos nécessaires
    if (id !== undefined && residence !== undefined && jour !== undefined && heure !== undefined && nom !== undefined && prenom !== undefined && chambre !== undefined) {
      // si le try passe, le fichier existe, sinon on renvoi une erreur
      try {
        // on récupère le planning
        const planning = JSON.parse(fs.readFileSync('./plannings/' + residence + '/' + id + '.json'));

        // on vérifie s'il y a quelqu'un ou pas sur ce créneau
        if (planning[jour][heure].nom !== '') {
          // on supprime le créneau
          planning[jour][heure].nom = '';
          planning[jour][heure].prenom = '';
          planning[jour][heure].chambre = '';

          // on enregistre les modifications
          this.fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

          // on ajoute la modification à l'historique
          this.addHistorique('Suppression du créneau', id, residence, nom, prenom, chambre, jour, heure);

          // on renvoit une réponse positive à la suppression
          res.status(200).send('Suppression réussi');
        }
        else {
          // on renvoi une erreur
          res.status(404).send('Il n\'y a pas d\'inscription sur ce créneau');
        }
      }
      catch (err) {
        // on renvoi une erreur
        res.status(404).send('Erreur dans les informations fournies')
      }
    }
    else {
      res.status(404).send('Erreur dans les informations fournies');
    }
  }

  // remet à 0 le planning et l'historique qui lui est associé
  remiseZero(id, residence, res) {
    // on récupère l'historique
    const planning = JSON.parse(fs.readFileSync('./plannings/' + residence + '/' + id + '.json'));

    // on déplace les données de dimanche 2 dans dimanche 1
    planning.dimanche1 = JSON.parse(JSON.stringify(planning.dimanche2));

    // on remet le reste à 0
    for (let jour in planning)
      if (jour !== 'dimanche1')
        for (let heure in planning[jour])
          for (let data in planning[jour][heure])
            planning[jour][heure][data] = '';

    // on enregistre les modifications
    fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

    // on réinitialise l'historique
    this.initHistorique(id, residence);

    // si la fonction a été appelé depuis une requète html, on renvoi une réponse positive
    if (res !== undefined) res.status(200).send('zero');
  }

  // initialisation de l'historique
  initHistorique(id, residence) {
    const historique = {historique: []};

    // on écrit la modification
    fs.writeFileSync('./historique/' + residence + '/' + 'historique_' + id + '.json', JSON.stringify(historique, null, 2));
  }

  // ajout à l'historique
  addHistorique(modification, id, residence, nom, prenom, chambre, jour, heure) {
    // on récupère la date actuelle
    const time = new Date(Date());

    // on récupère l'historique
    const historique = JSON.parse(fs.readFileSync('./historique/' + residence + '/' + 'historique_' + id + '.json'));

    // options pour l'enregistrement de la date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    historique.historique.push({
      modification: modification,
      dateModif: time.toLocaleDateString('fr-FR', options),
      nom: nom,
      prenom: prenom,
      chambre: chambre,
      jour: jour,
      heure: heure
    });

    // on enregistre les modifications
    fs.writeFileSync('./historique/' + residence + '/' + 'historique_' + id + '.json', JSON.stringify(historique, null, 2));
  }
}
