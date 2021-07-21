const mongoose = require("mongoose")

const PaymentSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  paid: {
    type: Boolean,
    required: true,
    default: true,
  },
  expryDate: {
    type: Date,
    required: true,
  },
  refund: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model("Payment", PaymentSchema)
