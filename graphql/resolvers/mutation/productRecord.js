const LongTermProduct = require("../../../models/LongTermProduct")
const ShortTermProduct = require("../../../models/ShortTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const { productToRecordValidation } = require("../../../helpers/validations")
const { productRecordReducer } = require("../../../helpers/reducers")

module.exports = {
  AddProductToRecord: async (_, { record, clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn } = await auth
      if (!isLoggedIn || client !== clientId)
        generateError("Access Denied, not authorized")

      const { name, productType, amount } = record
      const productToRecord =
        productType === "Long-term"
          ? await LongTermProduct.findOne({ $and: [{ name }, { clientId }] })
          : await ShortTermProduct.findOne({ $and: [{ name }, { clientId }] })
      if (!productToRecord)
        generateError("Product with that name doesn't exist")

      const { error } = productToRecordValidation(record)
      if (error) generateError(error.details[0].message)

      const { buyingPrice, dateOfEntry, description } = productToRecord
      if (amount > productToRecord.amount)
        generateError("Amount being recorded exceeds the amount in the stock")
      const newRecord = await new ProductRecord({
        ...record,
        clientId,
        buyingPrice,
        dateOfEntry,
        description,
      }).save()

      const ProductSchema =
        productType === "Short-term" ? ShortTermProduct : LongTermProduct
      await ProductSchema.updateOne(
        { _id: productToRecord._id },
        {
          $set: {
            amount: productToRecord.amount - amount,
          },
        }
      )
      return productRecordReducer(newRecord)
    } catch (e) {
      throw e
    }
  },
}
