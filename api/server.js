const portHTTPS = 1080;

const express = require('express');
const fs = require('fs');
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

const Gestion = require('./gestion');
const gestion = new Gestion();
gestion.addFS(fs);

app.get('/', (req, res) => {
  res.status(200).json('coucou');
});

app.get('/plannings/add/:id', (req, res) => {
  const informations = String(req.params.id);

  gestion.addCreneau(informations, res);
});

app.get('/plannings/remove/:id', (req, res) => {
  const informations = String(req.params.id);

  gestion.removeCreneau(informations, res);
});

app.get('plannings/getHistorique/:id/:name', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  const historique = require('./historique/' + residence + '/' + 'historique_' + id + '.json');
  res.status(200).json(historique);
});

app.get('plannings/getPlanning/:id/:name', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  const planning = require('./plannings/' + residence + '/' + id + '.json');
  res.status(200).json(planning);
});

app.get('/plannings/:id', (req, res) => {
  console.log('infos');
  const informations = String(req.params.id);

  let id, nom, prenom, residence, chambre;
  [id, nom, prenom, residence, chambre] = informations.split('+');

  const planning = require('./plannings/' + residence + '/' + id + '.json');
  // const textes = require('/home/rps/infosApp/' + id + '.json');
  // res.status(200).json(textes);
  res.status(200).json(planning);
});

// initialisation du json d'un planning
app.get('/plannings/init/:name/:id', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  gestion.initFile(id, residence, res);
});

// remise à zéro du planning
app.get('/plannings/zero/:name/:id', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  gestion.remiseZero(id, residence, res);
});

serverHTTPS.listen(portHTTPS);

console.log("let's go https port : " + portHTTPS);
