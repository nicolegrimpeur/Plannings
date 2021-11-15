// noinspection JSCheckFunctionSignatures

const portHTTPS = 1080;

const express = require('express');
const fs = require('fs');
const appHTTPS = express();
const serverHTTPS = require('http').createServer(appHTTPS);

appHTTPS.use(express.static(__dirname));
// pour l'api principalement
appHTTPS.use(function (req, res, next) {
  // site que je veux autoriser à se connecter
  res.setHeader('Access-Control-Allow-Origin', '*');

  // méthodes de connexion autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  next();
});

const Gestion = require('./gestion');
const gestion = new Gestion();
const path = './';
// const path = '/home/ubuntu/sites/plannings/api/';
gestion.addFS(fs);

appHTTPS.get('/plannings/add/:id', (req, res) => {
  const informations = String(req.params.id);

  gestion.addCreneau(informations, res);
});

appHTTPS.get('/plannings/remove/:id', (req, res) => {
  const informations = String(req.params.id);

  gestion.removeCreneau(informations, res);
});

appHTTPS.get('/plannings/getHistorique/:id/:name', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  const historique = JSON.parse(fs.readFileSync(path + 'historique/' + residence + '/' + 'historique_' + id + '.json'));
  res.status(200).json(historique);
});

appHTTPS.get('/plannings/getPlanning/:id/:name', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  const planning = JSON.parse(fs.readFileSync(path + 'plannings/' + residence + '/' + id + '.json'));
  res.status(200).json(planning);
});

appHTTPS.get('/plannings/getListPlannings', (req, res) => {
  const liste = JSON.parse(fs.readFileSync(path + 'listPlannings.json'));
  res.status(200).json(liste);
});

// initialisation du json d'un planning
appHTTPS.get('/plannings/init/:name/:id', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  gestion.initFile(id, residence, res);
});

// suppression du json d'un planning
appHTTPS.get('/plannings/removeFile/:name/:id', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  gestion.removeFile(id, residence, res);
});

// remise à zéro du planning
appHTTPS.get('/plannings/zero/:name/:id', (req, res) => {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  gestion.remiseZero(id, residence, res);
});

// modifie l'ordre des plannings d'une résidence
appHTTPS.get('/plannings/modifOrdrePlannings/:name/:id', (req, res) => {
  const informations = String(req.params.id);
  const residence = String(req.params.name);

  gestion.modifListePlanning(residence, informations, res);
});

// création d'une nouvelle résidence
appHTTPS.get('/plannings/createRes/:id/:name', (req, res) => {
  const id = String(req.params.id);
  const name = String(req.params.name);

  gestion.createResidence(id, name, res);
});

// suppression d'une résidence
appHTTPS.get('/plannings/supprRes/:id/:name', (req, res) => {
  const id = String(req.params.id);
  const name = String(req.params.name);

  gestion.supprResidence(id, name, res);
});

serverHTTPS.listen(portHTTPS);

console.log("let's go http port : " + portHTTPS);
