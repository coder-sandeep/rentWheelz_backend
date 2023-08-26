const Rentals = require("../models/rentals");
const Vehicle = require("../models/vehicle");
require("dotenv").config();

const getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find();
  return res.status(200).json({ success: true, vehicles: vehicles });
};

const getVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.body.vehicleId });
  console.log(req.body);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  return res.status(200).json({ success: true, vehicle: vehicle });
};
const getRentals = async (req, res) => {
  const rentals = await Rentals.find();
  if (!rentals) return res.status(404).json({ message: "No Rentals found" });
  return res.status(200).json({ success: true, rentals: rentals });
};
const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.status(200).json({ success: true, user: user });
};
const getOwner = async (req, res) => {
  const owner = await Owner.findOne({ _id: req.body.ownerId });
  if (!owner) return res.status(404).json({ message: "Owner not found" });
  return res.status(200).json({ success: true, owner: onwer });
};

module.exports = {
  getAllVehicles,
  getVehicle,
  getRentals,
  getOwner,
  getUser,
};
