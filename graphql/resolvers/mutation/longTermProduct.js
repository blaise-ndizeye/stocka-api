const LongTermProduct = require("../../../models/LongTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const {
  productValidation,
  productToRecordValidation,
} = require("../../../helpers/validations")
const {
  productReducer,
  productRecordReducer,
} = require("../../../helpers/reducers")

module.exports = {
  AddLongTermProduct: async (_, { product, clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn } = await auth
      if (!isLoggedIn || client !== clientId)
        generateError("Access Denied, not authorized")

      const { error } = productValidation(product)
      if (error) generateError(error.details[0].message)

      const productExists = await LongTermProduct.findOne({
        $and: [{ name: product.name }, { clientId }],
      })
      if (productExists) generateError("Product already exists")

      const newProduct = await new LongTermProduct({
        ...product,
        clientId,
      }).save()

      return productReducer(newProduct)
    } catch (e) {
      throw e
    }
  },
  UpdateLongTermProduct: async (
    _,
    { product, clientId, productId },
    { auth }
  ) => {
    try {
      const { clientId: client, isLoggedIn } = await auth
      if (!isLoggedIn || client !== clientId)
        generateError("Access Denied, not authorized")

      const productToUpdate = await LongTermProduct.findOne({
        $and: [{ clientId }, { _id: productId }],
      })
      if (!productToUpdate) generateError("Product doesn't exist")

      const { name, buyingPrice, pricePerUnit, description, amount } = product

      const { error } = productValidation({
        name,
        buyingPrice,
        pricePerUnit,
        description,
        amount,
      })
      if (error) generateError(error.details[0].message)

      await LongTermProduct.updateOne(
        { _id: productToUpdate._id },
        {
          $set: {
            name,
            buyingPrice,
            pricePerUnit,
            description,
            amount,
          },
        }
      )

      const updatedProduct = await LongTermProduct.findOne({
        $and: [{ clientId }, { _id: productId }],
      })

      return productReducer(updatedProduct)
    } catch (e) {
      throw e
    }
  },
  DeleteLongTermProduct: async (
    _,
    { productId, clientId, sellingPrice },
    { auth }
  ) => {
    try {
      const { clientId: client, isLoggedIn } = await auth
      if (!isLoggedIn || client !== clientId)
        generateError("Access Denied, not authorized")

      if (
        !sellingPrice ||
        typeof sellingPrice !== "number" ||
        sellingPrice <= 0
      )
        generateError("Enter a valid selling Price")

      const productExists = await LongTermProduct.findOne({
        $and: [{ _id: productId }, { clientId }],
      })
      if (!productExists) generateError("Product doesn't exist")

      await new ProductRecord({
        clientId,
        name: productExists.name,
        productType: "Long-term",
        buyingPrice: productExists.buyingPrice,
        sellingPrice,
        amount: productExists.amount,
        dateOfEntry: productExists.dateOfEntry,
        description: productExists.description,
      }).save()

      await LongTermProduct.deleteOne({ _id: productExists._id })
      return {
        success: true,
        message: "Long-tem product deleted successfully",
        product: productId,
      }
    } catch (e) {
      throw e
    }
  },
}
