const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema({
  ownerId: {
    type: String,
    required: true,
  },
  manufacturer: String,
  model: String,
  year: Number,
  category: {
    type: String,
    enum: ["two-wheeler", "four-wheeler"],
  },
  isElectricVehicle: Boolean,
  registrationNo: String,
  rentalPricePerDay: Number,
  isAvailable: {
    type: Boolean,
    default: true,
  },
  city: String,
  features: String,
  capacity: String,
  vehicleImage: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

(module.exports = Vehicle), vehicleSchema;
