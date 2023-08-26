const userController = require("../controllers/user");
const authController = require("../middleware/authentication");

const express = require("express");
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post(
  "/rentVehicle",
  authController.authenticateUser,
  userController.rentVehicle
);

module.exports = router;
