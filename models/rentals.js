const mongoose = require("mongoose");

const rentalsSchema = mongoose.Schema({
  vehicle: {
    type: {},
  },
  owner: {
    type: {},
  },
  user: {
    type: {},
  },
  rentalDates: {
    start: { type: Date },
    end: { type: Date },
  },
});

const Rentals = mongoose.model("Rentals", rentalsSchema);

module.exports = Rentals;
