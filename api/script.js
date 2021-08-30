// noinspection JSCheckFunctionSignatures

const fs = require('fs');

const Gestion = require('./gestion');
const gestion = new Gestion();

gestion.addFS(fs);


const paths = [
  {residence: 'sto', id: 'machine1'},
  // {residence: 'sto', id: 'machine2'},
];

// options pour l'enregistrement de la date
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

// remet à 0 les plannings dans paths
reset = () => {
  // on récupère le fichier de log
  const log = JSON.parse(fs.readFileSync('./log/log.json'));

  // on récupère la liste des résidences
  const liste = JSON.parse(fs.readFileSync('./listPlannings.json'));

  // on récupère la date actuelle
  const time = new Date(Date());

  try {
    // on parcours le tableau pour remettre à 0 les plannings inscrits
    for (let residence in liste['residences'])
      for (let nomPlanning of liste['residences'][residence])
        gestion.remiseZero(nomPlanning, residence);

    // on ajoute au log le succès
    log.log.push({
      dateModif: time.toLocaleDateString('fr-FR', options),
      modification: 'succès'
    });

  } catch (err) {
    // on ajoute au log l'erreur
    log.log.push({
      dateModif: time.toLocaleDateString('fr-FR', options),
      modification: 'erreur',
      erreur: err
    });
  }

  // on enregistre les modifications
  fs.writeFileSync('./log/log.json', JSON.stringify(log, null, 2));
}

checkDate = () => {
  // on récupère la date actuelle
  const time = new Date(Date());

  // on récupère le log
  const log = JSON.parse(fs.readFileSync('./log/log.json'));

  log.log.push({
    dateModif: time.toLocaleDateString('fr-FR', options),
    modification: 'check'
  });

  // on enregistre les modifications
  fs.writeFileSync('./log/log.json', JSON.stringify(log, null, 2));

  // si l'on est un dimanche et que la remise à 0 n'a pas encore été faite ou si la dernière exécution a été une erreur
  if ((time.getDay() === 0 && log.log[log.log.length - 1].dateModif !== time.toLocaleDateString('fr-FR', options)) || log.log[log.log.length - 1].modification === 'erreur') {
    reset();
  }
}

// lance la fonction toutes les 12 heures
setInterval(checkDate, 43200000);
