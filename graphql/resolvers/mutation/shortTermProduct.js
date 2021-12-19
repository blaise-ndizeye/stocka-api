const ShortTermProduct = require("../../../models/ShortTermProduct")
const ProductRecord = require("../../../models/ProductRecords")

const { generateError } = require("../../../utils/constants")
const { productValidation } = require("../../../helpers/validations")
const { productReducer } = require("../../../helpers/reducers")
const { shortTermProduct } = require("../../../helpers/findFunctions")

module.exports = {
  AddShortTermProduct: async (_, { product, clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const {
        name,
        dateOfExpry,
        buyingPrice,
        pricePerUnit,
        description,
        amount,
      } = product

      let today = new Date()
      if (dateOfExpry <= today.toISOString())
        generateError("Please enter a valid expiration date")

      const { error } = productValidation({
        name,
        buyingPrice,
        pricePerUnit,
        description,
        amount,
      })
      if (error) generateError(error.details[0].message)

      const productExists = await ShortTermProduct.findOne({
        $and: [{ name }, { clientId }],
      })
      if (productExists) generateError("Product already exists")

      const newProduct = await new ShortTermProduct({
        ...product,
        clientId,
      }).save()

      return productReducer(newProduct)
    } catch (e) {
      throw e
    }
  },

  UpdateShortTermProduct: async (
    _,
    { product, clientId, productId },
    { auth }
  ) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const productToUpdate = await ShortTermProduct.findOne({
        $and: [{ _id: productId }, { clientId }],
      })
      if (!productToUpdate) generateError("Product doesn't exist")

      const {
        name,
        dateOfExpry,
        buyingPrice,
        pricePerUnit,
        description,
        amount,
      } = product

      let today = new Date()
      if (dateOfExpry <= today.toISOString())
        generateError("Please enter a valid expiration date")

      const { error } = productValidation({
        name,
        buyingPrice,
        pricePerUnit,
        description,
        amount,
      })
      if (error) generateError(error.details[0].message)

      await ShortTermProduct.updateOne(
        {
          _id: productToUpdate._id,
        },
        {
          $set: {
            name,
            buyingPrice,
            pricePerUnit,
            description,
            amount,
            dateOfExpry,
          },
        }
      )

      return shortTermProduct({ productId, clientId })
    } catch (e) {
      throw e
    }
  },
  DeleteShortTermProduct: async (
    _,
    { productId, clientId, sellingPrice },
    { auth }
  ) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      if (!sellingPrice || typeof sellingPrice !== "number" || sellingPrice < 0)
        generateError("Enter a valid selling Price")

      const productExists = await ShortTermProduct.findOne({
        $and: [{ _id: productId }, { clientId }],
      })
      if (!productExists) generateError("Product doesn't exist")

      await new ProductRecord({
        clientId,
        name: productExists.name,
        productType: "Short-term",
        buyingPrice: productExists.buyingPrice,
        sellingPrice,
        amount: productExists.amount,
        dateOfEntry: productExists.dateOfEntry,
        description: productExists.description,
      }).save()

      await ShortTermProduct.deleteOne({ _id: productExists._id })
      return {
        success: true,
        message: "Short-term product deleted successfully",
        product: productId,
      }
    } catch (e) {
      throw e
    }
  },
}
