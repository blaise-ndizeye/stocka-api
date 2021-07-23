const mongoose = require("mongoose")

const StatusSchema = new mongoose.Schema(
  {
    costPremium: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Status", StatusSchema)
