const LongTermProduct = require("../../../models/LongTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const {
  productReducer,
  productRecordReducer,
} = require("../../../helpers/reducers")

module.exports = {
  LongTermProducts: async (_, { clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)
      const products = await LongTermProduct.find({ clientId }).sort({
        dateOfEntry: -1,
      })
      return products.map((product) => productReducer(product))
    } catch (e) {
      throw e
    }
  },
  LongTermProductRecords: async (_, { clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const records = await ProductRecord.find({
        $and: [{ clientId }, { productType: "Long-term" }],
      })
      return records.map((record) => productRecordReducer(record))
    } catch (e) {
      throw e
    }
  },
  AllLongTermProducts: async (_, { adminId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const products = await LongTermProduct.find().sort({ _id: -1 })
      return products.map((product) => productReducer(product))
    } catch (e) {
      throw e
    }
  },
  AllLongTermProductRecords: async (_, { adminId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const records = await ProductRecord.find({
        productType: "Long-term",
      }).sort({ _id: -1 })
      return records.map((record) => productRecordReducer(record))
    } catch (e) {
      throw e
    }
  },
}
