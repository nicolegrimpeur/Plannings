const fs = require('fs');

const Gestion = require('./gestion');
const gestion = new Gestion();

gestion.addFS(fs);

const paths = [
  {residence: 'sto', id: 'machine1'},
  {residence: 'sto', id: 'machine2'},
];

for (let path of paths) gestion.remiseZero(path.id, path.residence);
