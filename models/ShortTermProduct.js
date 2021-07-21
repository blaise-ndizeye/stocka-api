const mongoose = require("mongoose")

const ShortTermProductSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  buyingPrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  pricePerUnit: Number,
  dateOfEntry: {
    type: Date,
    default: Date.now(),
  },
  description: String,
  dateOfExpry: {
    type: Date,
    required: true,
  },
})

module.exports = mongoose.model("ShortTermProduct", ShortTermProductSchema)
