const mongoose = require("mongoose")

const LongTermProductSchema = new mongoose.Schema({
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
})

module.exports = mongoose.model("LongTermProduct", LongTermProductSchema)
