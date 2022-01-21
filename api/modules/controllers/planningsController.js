let PlanningsApi = require('../models/planningsApi');

exports.index = function (req, res) {
  res.sendFile(__dirname + '/index.html');
}

exports.addInscription = function (req, res) {
  const informations = String(req.params.id);

  PlanningsApi.addCreneau(informations, res);
}

exports.removeInscription = function (req, res) {
  const informations = String(req.params.id);

  PlanningsApi.removeCreneau(informations, res);
}

exports.getHistorique = function (req, res) {
  PlanningsApi.getHistorique(req, res);
}

exports.getPlanning = function (req, res) {
  PlanningsApi.getPLannings(req, res);
}

exports.getListPlannings = function (req, res) {
  PlanningsApi.getListPlannings(req, res)
}

exports.initPlannings = function (req, res) {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  PlanningsApi.initFile(id, residence, res);
}

exports.removePlanning = function (req, res) {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  PlanningsApi.removeFile(id, residence, res);
}

exports.zeroPlanning = function (req, res) {
  const id = String(req.params.id);
  const residence = String(req.params.name);

  PlanningsApi.remiseZero(id, residence, res);
}

exports.modifOrdrePlannings = function (req, res) {
  const informations = String(req.params.id);
  const residence = String(req.params.name);

  PlanningsApi.modifListePlanning(residence, informations, res);
}

exports.initResidence = function (req, res) {
  const id = String(req.params.id);
  const name = String(req.params.name);

  PlanningsApi.createResidence(id, name, res);
}

exports.removeResidence = function (req, res) {
  const id = String(req.params.id);
  const name = String(req.params.name);

  PlanningsApi.supprResidence(id, name, res);
}
