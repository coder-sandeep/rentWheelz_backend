const Admin = require("../models/admin");
const ownerController = require("../controllers/owner");
const Owner = require("../models/owner");
const tokenService = require("../services/tokenservice");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Vehicle = require("../models/vehicle");

require("dotenv").config();

const loginAdmin = async (req, res) => {
  try {
    const admins = await Admin.find({
      title: req.body.title,
    });

    const admin = admins[0];

    if (!admin)
      return res
        .status(404)
        .json({ message: "Error 404 : Admin not Found!", success: false });

    // const isValidPassword = await bcrypt.compare(req.body.password, admin.password);

    const isValidPassword = admin.password === req.body.password;

    if (!isValidPassword)
      return res.status(401).json({
        message: "Error 401 (Unauthorized) : Incorrect Password!",
        success: false,
      });

    return res.status(200).json({
      message: "Admin login succesfull!",
      success: true,
      token: tokenService.generateAccessToken({
        adminId: admin._id,
        name: admin.name,
        email: admin.email,
      }),
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

const approveOwnerRequest = async (req, res) => {
  try {
    const owner = await Owner.findById(req.body.ownerRequestId);
    owner.status = "approved";
    await owner.save();

    return res.status(200).json({
      success: true,
      message: "Owner approved!",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

const rejectOwnerRequest = async (req, res) => {
  try {
    const ownerRequest = await Owner.findById(req.body.ownerRequestId);
    ownerRequest.status = "rejected";
    await ownerRequest.save();

    return res.status(200).json({ success: true, message: "Owner Rejected!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

const approveVehicleRequest = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
    });
    vehicle.status = "approved";
    await vehicle.save();

    return res
      .status(200)
      .json({ success: true, message: "Successfully added vehicle!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

const rejectVehicleRequest = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
    });
    vehicle.status = "rejected";
    await vehicle.save();

    return res
      .status(200)
      .json({ success: true, message: "Successfully added vehicle!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

const getOwnerRequests = async (req, res) => {
  try {
    const requests = await Owner.find({});
    return res.status(200).json(requests);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

module.exports = {
  loginAdmin,
  approveOwnerRequest,
  rejectOwnerRequest,
  approveVehicleRequest,
  rejectVehicleRequest,
  getOwnerRequests,
};
