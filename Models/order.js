const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the Customer collection
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  suitePrice: {
    type: Number,
    required: true
  },
  designPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  advance: {
    type: Number,
    required: true
  },
  remaining: {
    type: Number,
    required: false
  },
  orderDate: {
    type: Date,
    required: true
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  salaiType: {
    type: String,
    required: true
  },
  suiteNumber: {
    type: Number,
    required: true
  },
  properties: {
    type: [String], // Array of strings to store selected properties
    default: []
  }
});

module.exports = mongoose.model('Order', orderSchema);
