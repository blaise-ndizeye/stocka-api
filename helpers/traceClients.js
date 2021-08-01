const Client = require("mongoose").model("Client")
const Payment = require("mongoose").model("Payment")

const { newDate } = require("../utils/constants")

const traceClients = async () => {
  try {
    let toDay = newDate(new Date(), 0)
    const clients = await Client.find().sort({ _id: -1 })
    for (let i in clients) {
      let clientId = clients[i]._id
      const payment = await Payment.findOne({ clientId })

      if (payment.expryDate <= toDay) {
        await Payment.updateOne(
          { clientId },
          {
            $set: {
              paid: false,
              expryDate: toDay,
            },
          }
        )
      }
    }
    console.log("💼 Payments updated Successfully")
  } catch (e) {
    throw e
  }
}

module.exports = traceClients
