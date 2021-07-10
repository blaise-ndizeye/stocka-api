const ShortTermProduct = require("../../../models/ShortTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const { productReducer } = require("../../../helpers/reducers")

module.exports = {
  ShortTermProducts: async (_, { clientId }, { auth }) => {
    const { clientId: client, isLoggedIn } = await auth
    if (!isLoggedIn || client !== clientId)
      generateError("Access Denied, not authorized")

    const products = await ShortTermProduct.find({ clientId }).sort({
      dateOfEntry: -1,
    })
    return products.map((product) => productReducer(product))
  },
}
