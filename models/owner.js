const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profileImage: String,
  contact: {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    fullAddress: String,
    country: String,
    state: String,
    city: String,
    area: String,
    pinCode: String,
    houseNo: String,
  },
  identificationInfo: {
    aadhaarNo: {
      type: String,
      // required: true
    },
    aadhaarImage: {
      front: String,
      back: String,
      // required: true
    },
    panNo: String,
    panImage: {
      front: String,
      back: String,
    },
  },
  bankAccountDetails: {
    bankName: String,
    accountNo: String,
    ifscCode: String,
    linkedMobileNo: String,
  },
  rentalRequests: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Owner = mongoose.model("Owner", ownerSchema);

(module.exports = Owner), ownerSchema;
