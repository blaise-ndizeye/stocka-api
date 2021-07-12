const Client = require("mongoose").model("Client")
const ShortTermProduct = require("mongoose").model("ShortTermProduct")
const LongTermProduct = require("mongoose").model("LongTermProduct")
const ProductRecord = require("mongoose").model("ProductRecords")

const {
  clientReducer,
  productReducer,
  productRecordReducer,
} = require("./reducers")

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
  async longTermProducts({ _id }) {
    const data = await LongTermProduct.find({ clientId: _id })
    return data.map((product) => productReducer(product))
  },
  async shortTermProducts({ _id }) {
    const data = await ShortTermProduct.find({ clientId: _id })
    return data.map((product) => productReducer(product))
  },
  async shortTermProductsRecords({ _id }) {
    const data = await ProductRecord.find({
      $and: [{ clientId: _id }, { productType: "Short-term" }],
    })
    return data.map((product) => productRecordReducer(product))
  },
  async longTermProductsRecords({ _id }) {
    const data = await ProductRecord.find({
      $and: [{ clientId: _id }, { productType: "Long-term" }],
    })
    return data.map((product) => productRecordReducer(product))
  },
}
