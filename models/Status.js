const mongoose = require("mongoose")

const StatusSchema = new mongoose.Schema(
  {
    premiumCost: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Status", StatusSchema)
