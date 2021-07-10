const mongoose = require("mongoose")

const LongRecordsSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  productType: {
    type: String,
    required: true,
  },
  buyingPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dateOfEntry: {
    type: Date,
    required: true,
  },
  dateRecorded: {
    type: Date,
    default: Date.now(),
  },
  description: String,
})

module.exports = mongoose.model("LongRecords", LongRecordsSchema)
