// noinspection JSCheckFunctionSignatures

const portHTTPS = 1080;

const express = require('express');
const appHTTPS = express();
const serverHTTPS = require('http').createServer(appHTTPS);

const mdpRouter = require('./modules/routes/mdpRoutes');
const planningsRouter = require('./modules/routes/planningsRoutes');

appHTTPS.use(express.static(__dirname));
// pour l'api principalement
appHTTPS.use(function (req, res, next) {
  // site que je veux autoriser à se connecter
  res.setHeader('Access-Control-Allow-Origin', '*');

  // méthodes de connexion autorisées
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  next();
});

appHTTPS.use('/mdpRP', mdpRouter);
appHTTPS.use('/plannings', planningsRouter);

serverHTTPS.listen(portHTTPS);

console.log("let's go http port : " + portHTTPS);
