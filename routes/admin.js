const authController = require("../middleware/authentication");
const adminController = require("../controllers/admin");
const ownerController = require("../controllers/owner");

const express = require("express");
const router = express.Router();

router.post("/login", adminController.loginAdmin);

router.get("/getOwnerRequests", adminController.getOwnerRequests);

router.post(
  "/approveOwnerRequest",
  authController.authenticateAdmin,
  adminController.approveOwnerRequest
);

router.post(
  "/rejectOwnerRequest",
  authController.authenticateAdmin,
  adminController.rejectOwnerRequest
);

router.post(
  "/approveVehicleRequest",
  authController.authenticateAdmin,
  adminController.approveVehicleRequest
);

router.post(
  "/rejectVehicleRequest",
  authController.authenticateAdmin,
  adminController.rejectVehicleRequest
);

module.exports = router;
