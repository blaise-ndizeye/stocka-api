const LongTermProduct = require("../../../models/LongTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const { productReducer } = require("../../../helpers/reducers")

module.exports = {
  LongTermProducts: async (_, { clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn } = await auth
      if (!isLoggedIn || client !== clientId)
        generateError("Access Denied, not authorized")
      const products = await LongTermProduct.find({ clientId }).sort({
        dateOfEntry: -1,
      })
      return products.map((product) => productReducer(product))
    } catch (e) {
      throw e
    }
  },
}
