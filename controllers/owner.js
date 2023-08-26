const tokenService = require("../services/tokenservice");
const Vehicle = require("../models/vehicle");
const Owner = require("../models/owner");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dprfbnqlh",
  api_key: "892734379352189",
  api_secret: "NgtPt70d8-M_AcmZ12AN8hoghhA",
});

require("dotenv").config();

const register = async (req, res) => {
  try {
    const ownerDetails = req.body;

    let owner = await Owner.findOne({
      "contact.email": req.body.email,
    });

    if (owner)
      return res
        .status(400)
        .json({ message: "Email already registered!", success: false });

    let ownerRequest1 = await Owner.findOne({
      "contact.phone": req.body.phone,
    });

    if (ownerRequest1)
      return res
        .status(400)
        .json({ message: "Phone already registered!", success: false });

    const ownerDataObject = {
      name: ownerDetails.name,
      contact: {
        phone: ownerDetails.phone,
        email: ownerDetails.email,
      },
      password: ownerDetails.password,
    };

    owner = new Owner(ownerDataObject);

    const result = await owner.save();

    return res.status(200).json({
      message: "Successfuly signed up...",
      success: true,
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

const onUploadOwnerFiles = async (req, res) => {
  const ownerDetails = req.owner;
  try {
    const { profile_photo, aadhaar_front, aadhaar_back, pan_front, pan_back } =
      req.files;
    const { aadhaar_no, pan_no } = req.body;

    const owner = await Owner.findOne({
      "contact.email": ownerDetails.contact.email,
    });

    if (!owner)
      return res
        .status(404)
        .json({ success: false, message: "Owner not registered!" });

    const res0 = await cloudinary.uploader.upload(profile_photo[0].path);
    const res1 = await cloudinary.uploader.upload(aadhaar_front[0].path);
    const res2 = await cloudinary.uploader.upload(aadhaar_back[0].path);
    const res3 = await cloudinary.uploader.upload(pan_front[0].path);
    const res4 = await cloudinary.uploader.upload(pan_back[0].path);

    owner.profileImage = res0.url;
    owner.identificationInfo.aadhaarImage.front = res1.url;
    owner.identificationInfo.aadhaarImage.back = res2.url;
    owner.identificationInfo.panImage.front = res3.url;
    owner.identificationInfo.panImage.back = res4.url;

    if (aadhaar_no) owner.identificationInfo.aadhaarNo = aadhaar_no;
    if (pan_no) owner.identificationInfo.panNo = pan_no;

    const result = await owner.save();

    return res.status(200).json({ success: true, message: "Files Uploaded!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

const createOwner = async (ownerRequestId) => {
  try {
    const owner = await Owner.findById(ownerRequestId);
    const {
      name,
      profileImage,
      contact,
      password,
      address,
      identificationInfo,
      bankAccountDetails,
      status,
    } = owner;

    const ownerDataObject = {
      name,
      profileImage,
      contact,
      password,
      address,
      identificationInfo,
      bankAccountDetails,
      status,
    };
    const ownerDetails = new Owner(ownerDataObject);
    const result = await ownerDetails.save();
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const loginOwner = async (req, res) => {
  try {
    let owner = await Owner.findOne({
      "contact.email": req.body.email,
    });

    if (!owner)
      return res
        .status(404)
        .json({ message: "Error 404 : Owner not Found!", success: false });

    // const isValidPassword = await bcrypt.compare(req.body.password, ownerDetails.password);

    const isValidPassword = req.body.password === owner.password;
    if (!isValidPassword)
      return res.status(401).json({
        message: "Error 401 (Unauthorized) : Incorrect Password!",
        success: false,
      });

    return res.status(200).json({
      message: "Owner login succesfull!",
      success: true,
      token: tokenService.generateAccessToken({
        ownerId: owner._id,
        name: owner.name,
        email: owner.email,
      }),
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

const addAddress = async (req, res) => {
  try {
    const ownerDetails = req.owner;
    const owner = await Owner.findOne({
      "contact.email": ownerDetails.contact.email,
    });

    if (!owner)
      return res.status(404).json({
        success: false,
        message: "Owner not registered!",
      });

    const ownerAddress = req.body;
    owner.address = ownerAddress;

    const result = await owner.save();

    return res.status(200).json({
      success: true,
      message: "Successfully added address!",
      result: result,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
const addBankDetails = async (req, res) => {
  try {
    const ownerDetails = req.owner;
    const owner = await Owner.findOne({
      "contact.email": ownerDetails.contact.email,
    });

    if (!owner)
      return res.status(404).json({
        success: false,
        message: "Owner not registered!",
      });

    const bankAccountDetails = req.body;
    owner.bankAccountDetails = bankAccountDetails;

    const result = await owner.save();

    return res.status(200).json({
      success: true,
      message: "Successfully added bank acount details for verification!",
      result: result,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const addNewVehicleRequest = async (req, res) => {
  try {
    const ownerDetails = req.owner;

    const {
      manufacturer,
      model,
      year,
      category,
      isElectricVehicle,
      registrationNo,
      rentalPricePerDay,
      isAvailable,
      location,
      features,
      capacity,
      images,
      city,
    } = req.body;

    const vehicle = new Vehicle({
      ownerId: ownerDetails._id,
      manufacturer,
      model,
      year,
      isElectricVehicle,
      category,
      registrationNo,
      rentalPricePerDay,
      isAvailable,
      location,
      features,
      capacity,
      images,
      city,
    });

    const result = await vehicle.save();

    return res.status(200).json({
      message: "Request for vehicle sent successfully...",
      success: true,
      result: result,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

const onUploadVehicleImages = async (req, res) => {
  try {
    const vehicleRequests = await Vehicle.find({
      _id: req.body.vehicleId,
    });

    const vehicleRequest = vehicleRequests[0];

    if (!vehicleRequest)
      return res
        .status(404)
        .json({ success: false, message: "Vehicle request not found!" });

    const { vehicle_image1 } = req.files;
    console.log(vehicle_image1);

    const res0 = await cloudinary.uploader.upload(vehicle_image1[0].path);

    vehicleRequest.vehicleImage = res0.url;
    console.log(vehicleRequest);

    await vehicleRequest.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle images uploaded successfully!",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong!" });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const ownerDetails = req.owner;

    const vehicles = await Vehicle.find({
      ownerId: ownerDetails._id,
    });

    return res.status(200).json({ success: true, vehicles: vehicles });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

const getVehicle = async (req, res) => {
  try {
    const ownerDetails = req.owner;
    const ownerId = ownerDetails._id;
    const vehicleId = req.params.vehicleId;

    const vehicle = await vehicle.findOne({
      ownerId: ownerId,
      vehicleId: vehicleId,
    });

    if (!vehicle)
      return res
        .status(404)
        .json({ success: false, message: "vehicle not found!" });

    return res.status(200).json({ success: true, vehicles: vehicle });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};
const getOwner = async (req, res) => {
  try {
    const ownerDetails = req.owner;
    const owner = await Owner.findOne({
      "contact.email": ownerDetails.contact.email,
    });

    if (!owner)
      return res
        .status(404)
        .json({ success: false, message: "Owner not found!" });
    return res.status(200).json({ success: true, ownerDetails: ownerDetails });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

module.exports = {
  register,
  createOwner,
  loginOwner,
  addAddress,
  addBankDetails,
  addNewVehicleRequest,
  getAllVehicles,
  getVehicle,
  onUploadOwnerFiles,
  onUploadVehicleImages,
  getOwner,
};
