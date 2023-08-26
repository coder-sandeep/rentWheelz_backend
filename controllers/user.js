const tokenService = require("../services/tokenservice");
const Owner = require("../models/owner");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Vehicle = require("../models/vehicle");
const jwt = require("jsonwebtoken");
const Rentals = require("../models/rentals");

require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user)
      return res
        .status(400)
        .json({ message: "User already exist, Please login", success: false });

    const salt = await bcrypt.genSalt(10);
    let password = req.body.password;
    password = await bcrypt.hash(password, salt);

    user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: password,
    });
    console.log(user);

    const result = await user.save();

    return res
      .status(200)
      .json({ message: "Successfuly signed up...", success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const users = await User.find({
      email: req.body.email,
    });

    const user = users[0];

    if (!user)
      return res
        .status(404)
        .json({ message: "Error 404 : User not Found!", success: false });

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword)
      return res.status(401).json({
        message: "Error 401 (Unauthorized) : Incorrect Password!",
        success: false,
      });

    return res.status(200).json({
      message: "User login succesfull!",
      success: true,
      token: tokenService.generateAccessToken({
        userId: user._id,
        name: user.name,
        email: user.email,
      }),
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};
const rentVehicle = async (req, res) => {
  try {
    const { start, end } = req.body;
    const user = req.user;

    const vehicle = await Vehicle.findOne({
      _id: req.body.vehicleId,
    });
    const owner = await Owner.findOne({
      _id: vehicle.ownerId,
    });
    if (vehicle) {
      const vehicleRental = new Rentals({
        vehicle,
        user,
        rentalDates: { start, end },
        owner,
      });

      console.log({
        vehicle,
        user,
        rentalDates: { start, end },
        owner,
      });

      await vehicleRental.save();
    }
    return res.status(200).json({ message: "Rented vehicle", success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Some error occurred!", success: false });
  }
};

module.exports = {
  registerUser,
  loginUser,
  rentVehicle,
};
