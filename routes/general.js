const generalController = require("../controllers/general");
const express = require("express");
const router = express.Router();

router.get("/getAllVehicles", generalController.getAllVehicles);
router.post("/getVehicle", generalController.getVehicle);
router.get("/rentals", generalController.getRentals);

module.exports = router;
