const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerId: { type: String, required: true },
  qamizLength: { type: Number, required: false },
  shalwarLength: { type: Number, required: false },
  teera: { type: Number, required: false },
  bazoo: { type: Number, required: false },
  chati: { type: Number, required: false },
  kamr: { type: Number, required: false },
  daman: { type: Number, required: false },
  asen: { type: Number, required: false },
  paincha: { type: Number, required: false },
}, { timestamps: true });

module.exports = mongoose.model('Measurement', measurementSchema);
