const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Owner = require("../models/owner");
const Admin = require("../models/admin");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  try {
    const payload = getPayLoad(req);
    const user = await User.findById(payload.userId);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};

const authenticateOwner = async (req, res, next) => {
  try {
    const payload = getPayLoad(req);
    const owner = await Owner.findById(payload.ownerId);
    req.owner = owner;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};

const authenticateAdmin = async (req, res, next) => {
  try {
    const payload = getPayLoad(req);
    const admin = await Admin.findById(payload.adminId);
    req.admin = admin;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};

function getPayLoad(req) {
  const token = req.get("Authorization");
  const payload = jwt.verify(token, process.env.PRIVATE_KEY);
  return payload;
}

module.exports = {
  authenticateUser,
  authenticateOwner,
  authenticateAdmin,
};
