const express = require("express");
const router = express.Router();

const mdp_controller = require("../controllers/mdpController");

router.get('/:id', mdp_controller.checkMdp);

module.exports = router;
