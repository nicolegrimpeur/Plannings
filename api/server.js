const portHTTPS = 1080;

const express = require('express');
let fs = require('fs');
const app = express();
const serverHTTPS = require('http').createServer(app);

app.use(express.static(__dirname));
// pour l'api principalement
app.use(function (req, res, next) {
  // site que je veux autoriser à se connecter
  res.setHeader('Access-Control-Allow-Origin', '*');

  // méthodes de connexion autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  next();
});

app.get('/', function (req, res) {
  res.status(200).json('coucou');
});

app.get('/plannings/:id', function (req, res) {
  const informations = String(req.params.id);

  let id, nom, prenom, residence, chambre;
  [id, nom, prenom, residence, chambre] = informations.split('+');

  const planning = require('./plannings/' + residence + '/' + id + '.json');
  // const textes = require('/home/rps/infosApp/' + id + '.json');
  // res.status(200).json(textes);
  res.status(200).json(planning);

});

serverHTTPS.listen(portHTTPS);

console.log("let's go https port : " + portHTTPS);
