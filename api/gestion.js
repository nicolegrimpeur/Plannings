const fs = require("fs");
module.exports = class Gestion {
  fs = '';
  constructor() {
  }

  addFS(fs_) {
    this.fs = fs_;
  }

  initFile(id, residence, res) {
    const data = {
      "nom": "",
      "prenom": "",
      "chambre": ""
    }

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

    fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(jours, null, 2));

    this.initHistorique(id, residence);

    if (res !== undefined) res.status(200).json('ok');
  }

  addCreneau(informations, res) {
    let id, nom, prenom, residence, chambre, jour, heure;
    [id, residence, jour, heure, nom, prenom, chambre] = informations.split('+');

    // on vérifie que l'on a toutes les infos nécessaires
    if (id !== undefined && residence !== undefined && jour !== undefined && heure !== undefined && nom !== undefined && prenom !== undefined && chambre !== undefined) {
      try {
        const planning = require('./plannings/' + residence + '/' + id + '.json');

        // on vérifie qu'il n'y a pas déjà quelqu'un sur ce créneau
        if (planning[jour][heure].nom === '') {
          planning[jour][heure].nom = nom;
          planning[jour][heure].prenom = prenom;
          planning[jour][heure].chambre = chambre;
          this.fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

          this.addHistorique('Inscription sur le créneau', id, residence, nom, prenom, chambre, jour, heure);

          res.status(200).send('Inscription réussi');
        }
        else {
          res.status(404).send('Créneau déjà utilisé')
        }
      }
      catch (err) {
        this.initFile(residence, id);
        this.addCreneau(informations, res);
      }
    }
    else {
      res.status(404).send('Erreur dans les informations fournies');
    }
  }

  removeCreneau(informations, res) {
    let id, nom, prenom, residence, chambre, jour, heure;
    [id, residence, jour, heure, nom, prenom, chambre] = informations.split('+');

    // on vérifie que l'on a toutes les infos nécessaires
    if (id !== undefined && residence !== undefined && jour !== undefined && heure !== undefined && nom !== undefined && prenom !== undefined && chambre !== undefined) {
      try {
        const planning = require('./plannings/' + residence + '/' + id + '.json');

        // on vérifie qu'il n'y a pas déjà quelqu'un sur ce créneau
        if (planning[jour][heure].nom !== '') {
          planning[jour][heure].nom = '';
          planning[jour][heure].prenom = '';
          planning[jour][heure].chambre = '';
          this.fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

          this.addHistorique('Suppression du créneau', id, residence, nom, prenom, chambre, jour, heure);

          res.status(200).send('Suppression réussi');
        }
        else {
          res.status(404).send('Il n\'y a pas d\'inscription sur ce créneau');
        }
      }
      catch (err) {
        res.status(404).send('Erreur dans les informations fournies')
      }
    }
    else {
      res.status(404).send('Erreur dans les informations fournies');
    }
  }

  remiseZero(id, residence, res) {
    const planning = require('./plannings/' + residence + '/' + id + '.json');

    planning.dimanche1 = JSON.parse(JSON.stringify(planning.dimanche2));

    for (let jour in planning) {
      if (jour !== 'dimanche1') {
        for (let heure in planning[jour])
          for (let data in planning[jour][heure])
            planning[jour][heure][data] = '';
      }
    }

    fs.writeFileSync('./plannings/' + residence + '/' + id + '.json', JSON.stringify(planning, null, 2));

    this.initHistorique(id, residence);

    if (res !== undefined) res.status(200).send('zero');
  }

  initHistorique(id, residence) {
    const historique = {};
    fs.writeFileSync('./historique/' + residence + '/' + 'historique_' + id + '.json', JSON.stringify(historique, null, 2));
  }

  addHistorique(modification, id, residence, nom, prenom, chambre, jour, heure) {
    const time = Date();

    const historique = JSON.parse(fs.readFileSync('./historique/' + residence + '/' + 'historique_' + id + '.json'));

    historique[time] = {
      modification: modification,
      nom: nom,
      prenom: prenom,
      chambre: chambre,
      jour: jour,
      heure: heure
    };

    fs.writeFileSync('./historique/' + residence + '/' + 'historique_' + id + '.json', JSON.stringify(historique, null, 2));
  }
}
