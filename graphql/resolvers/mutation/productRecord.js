const LongTermProduct = require("../../../models/LongTermProduct")
const ShortTermProduct = require("../../../models/ShortTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const { productToRecordValidation } = require("../../../helpers/validations")
const { productRecordReducer } = require("../../../helpers/reducers")

module.exports = {
  AddProductToRecord: async (_, { record, clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

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
        buyingPrice: productToRecord.pricePerUnit * amount,
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
            buyingPrice:
              productToRecord.buyingPrice -
              productToRecord.pricePerUnit * amount,
          },
        }
      )
      return productRecordReducer(newRecord)
    } catch (e) {
      throw e
    }
  },
  DeleteProductRecord: async (_, { clientId, recordId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const recordExists = await ProductRecord.findOne({
        $and: [{ clientId }, { _id: recordId }],
      })
      if (!recordExists) generateError("Product record doesn't exist")
      let record = {
        id: recordExists._id,
        productType: recordExists.productType,
      }
      await ProductRecord.deleteOne({ _id: recordExists._id })
      return {
        success: true,
        message: "Product record deleted successfully",
        record: record.id,
        productType: record.productType,
      }
    } catch (e) {
      throw e
    }
  },
  DeleteSelectedRecords: async (_, { clientId, records }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      let deletedRecords = []
      let missedRecords = []
      for (let i in records) {
        let _id = records[i]
        const recordExists = await ProductRecord.findOne({ _id })
        if (!recordExists) {
          missedRecords.push(_id)
          continue
        }
        await ProductRecord.deleteOne({ _id })
        deletedRecords.push(_id)
      }
      return {
        success: true,
        message: "Operation performed successfully",
        deletedRecords,
        missedRecords,
      }
    } catch (e) {
      throw e
    }
  },
}
