const express = require("express");
const router = express.Router();

const plannings_controller = require("../controllers/planningsController");

router.get('/', plannings_controller.index);

router.get('/add/:id', plannings_controller.addInscription);

router.get('/remove/:id', plannings_controller.removeInscription);

router.get('/getHistorique/:id/:name', plannings_controller.getHistorique);

router.get('/getPlanning/:id/:name', plannings_controller.getPlanning);

router.get('/getListPlannings', plannings_controller.getListPlannings);

router.get('/init/:name/:id', plannings_controller.initPlannings);

router.get('/removeFile/:name/:id', plannings_controller.removePlanning);

router.get('/zero/:name/:id', plannings_controller.zeroPlanning);

router.get('/modifOrdrePlannings/:name/:id', plannings_controller.modifOrdrePlannings);

router.get('/createRes/:id/:name', plannings_controller.initResidence);

router.get('/supprRes/:id/:name', plannings_controller.removeResidence);

module.exports = router;
