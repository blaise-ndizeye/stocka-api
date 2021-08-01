const Client = require("mongoose").model("Client")
const Payment = require("mongoose").model("Payment")
const Notification = require("mongoose").model("Notification")
const ShortTermProduct = require("mongoose").model("ShortTermProduct")

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

        let msg =
          "Your premium duration has reached to end, Please pay for the next premium"

        const notificationExist = await Notification.findOne({
          $and: [{ clientId }, { source: "Payment" }, { message: msg }],
        })
        if (!notificationExist) {
          await new Notification({
            clientId,
            source: "Payment",
            message: msg,
          }).save()
        }
      }
    }
    console.log("💼 Payments updated Successfully")
  } catch (e) {
    throw e
  }
}

const traceProducts = async () => {
  try {
    let toDay = newDate(new Date(), 0)
    const products = await ShortTermProduct.find().sort({ _id: -1 })
    for (let i in products) {
      let product = products[i]

      if (product.dateOfExpry <= toDay) {
        let msg = `Product: ${product.name} with amount: ${product.amount} has been expired`

        const notificationExist = await Notification.findOne({
          $and: [
            {
              clientId: product.clientId,
              source: "Short-term Product",
              message: msg,
            },
          ],
        })

        if (!notificationExist) {
          await new Notification({
            clientId: product.clientId,
            source: "Short-term Product",
            message: msg,
          }).save()
        }
      }
    }
    console.log("⏲  Expry notifications set successfully")
  } catch (e) {
    throw e
  }
}

module.exports = { traceClients, traceProducts }
