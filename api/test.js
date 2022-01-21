const fs = require('fs');

let dirCont = fs.readdirSync('./');
let file = 'ngs.js';
let id = file.indexOf('.');
let debutFile = file.slice(0, id);

let regex = new RegExp(debutFile + '\.[0-9a-zA-Z\-]*.js', "g");
console.log(regex);
let files = dirCont.filter( function( elm ) {return elm.match(regex);});

console.log(files);
