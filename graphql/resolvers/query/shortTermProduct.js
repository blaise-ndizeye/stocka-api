const ShortTermProduct = require("../../../models/ShortTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const {
  productReducer,
  productRecordReducer,
} = require("../../../helpers/reducers")

module.exports = {
  ShortTermProducts: async (_, { clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const products = await ShortTermProduct.find({ clientId }).sort({
        dateOfEntry: -1,
      })
      return products.map((product) => productReducer(product))
    } catch (e) {
      throw e
    }
  },
  ShortTermProductRecords: async (_, { clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const records = await ProductRecord.find({
        $and: [{ clientId }, { productType: "Short-term" }],
      })
      return records.map((record) => productRecordReducer(record))
    } catch (e) {
      throw e
    }
  },
  AllShortTermProducts: async (_, { adminId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const products = await ShortTermProduct.find().sort({ _id: -1 })
      return products.map((product) => productReducer(product))
    } catch (e) {
      throw e
    }
  },
  AllShortTermProductRecords: async (_, { adminId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const records = await ProductRecord.find({
        productType: "Short-term",
      }).sort({ _id: -1 })
      return records.map((record) => productRecordReducer(record))
    } catch (e) {
      throw e
    }
  },
}
