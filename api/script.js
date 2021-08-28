// noinspection JSCheckFunctionSignatures

const fs = require('fs');

const Gestion = require('./gestion');
const gestion = new Gestion();

gestion.addFS(fs);

// options pour l'enregistrement de la date
const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

reset = () => {
  const paths = [
    {residence: 'sto', id: 'machine1'},
    // {residence: 'sto', id: 'machine2'},
  ];

  // on récupère le fichier de log
  const log = JSON.parse(fs.readFileSync('./log/log.json'));

  // on récupère la date actuelle
  const time = new Date(Date());

  try {
    // on parcours le tableau pour remettre à 0 les plannings inscrits dans paths
    for (let path of paths) gestion.remiseZero(path.id, path.residence);

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

  // si l'on est un dimanche et que la remise à  n'a pas encore été faite
  if (time.getDay() === 0 && log.log[log.log.length - 1].dateModif !== time.toLocaleDateString('fr-FR', options)) {
    reset();
  }
}

setInterval(checkDate, 43200000);
