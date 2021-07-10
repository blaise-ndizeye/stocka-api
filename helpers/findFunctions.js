const Client = require("mongoose").model("Client")
const ShortTermProduct = require("mongoose").model("ShortTermProduct")
const LongTermProduct = require("mongoose").model("LongTermProduct")

const { clientReducer, productReducer } = require("./reducers")

module.exports = {
  async client({ client }) {
    const data = await Client.findOne({ _id: client })
    if (!data) return {}
    return clientReducer(data)
  },

  async shortTermProduct({ productId, clientId }) {
    const data = await ShortTermProduct.findOne({
      $and: [{ _id: productId }, { clientId }],
    })
    if (!data) return {}
    return productReducer(data)
  },
}
