const authController = require("../middleware/authentication");
const { upload } = require("../services/storageservice");
const ownerController = require("../controllers/owner");

const express = require("express");
const router = express.Router();

router.post("/register", ownerController.register);

router.post(
  "/ownerRequest/uploadFile",
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "aadhaar_front", maxCount: 1 },
    { name: "aadhaar_back", maxCount: 1 },
    { name: "pan_front", maxCount: 1 },
    { name: "pan_back", maxCount: 1 },
  ]),
  authController.authenticateOwner,
  ownerController.onUploadOwnerFiles
);

router.post("/login", ownerController.loginOwner);

router.post(
  "/addAddress",
  authController.authenticateOwner,
  ownerController.addAddress
);

router.post(
  "/addBankDetails",
  authController.authenticateOwner,
  ownerController.addBankDetails
);

router.post(
  "/addNewVehicleRequest",
  authController.authenticateOwner,
  ownerController.addNewVehicleRequest
);

router.post(
  "/vehicle/addImages",
  upload.fields([
    { name: "vehicle_image1", maxCount: 1 },
    { name: "vehicle_image2", maxCount: 1 },
    { name: "vehicle_image3", maxCount: 1 },
  ]),
  // authController.authenticateOwner,
  ownerController.onUploadVehicleImages
);
router.post(
  "/getOwner",
  authController.authenticateOwner,
  ownerController.getOwner
);
router.get(
  "/vehicles",
  authController.authenticateOwner,
  ownerController.getAllVehicles
);

router.post(
  "/vehicles/:vehicleId",
  authController.authenticateOwner,
  ownerController.getVehicle
);

module.exports = router;
