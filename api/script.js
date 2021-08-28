// noinspection JSCheckFunctionSignatures

const fs = require('fs');

const Gestion = require('./gestion');
const gestion = new Gestion();

gestion.addFS(fs);

const paths = [
  {residence: 'sto', id: 'machine1'},
  {residence: 'sto', id: 'machine2'},
];

// on récupère le fichier de log
const log = JSON.parse(fs.readFileSync('./log/log.json'));

// on récupère la date actuelle
const time = new Date(Date());

// options pour l'enregistrement de la date
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

try {
  for (let path of paths) gestion.remiseZero(path.id, path.residence);

  log.log.push({
    dateModif: time.toLocaleDateString('fr-FR', options),
    modification: 'succès'
  });

}
catch (err) {
  log.log.push({
    dateModif: time.toLocaleDateString('fr-FR', options),
    modification: 'erreur',
    erreur: err
  });

}

// on enregistre les modifications
fs.writeFileSync('./log/log.json', JSON.stringify(log, null, 2));
