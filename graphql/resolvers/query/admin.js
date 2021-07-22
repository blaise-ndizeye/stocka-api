const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Admin = require("../../../models/Admin")
const Notification = require("../../../models/Notification")
const ShortTermProduct = require("../../../models/ShortTermProduct")
const LongTermProduct = require("../../../models/LongTermProduct")
const ProductRecords = require("../../../models/ProductRecords")

const {
  loginValidation,
  emailValidation,
} = require("../../../helpers/validations")

const {
  notificationReducer,
  productReducer,
  productRecordReducer,
} = require("../../../helpers/reducers")
const { generateError } = require("../../../utils/constants")
const sendMail = require("../../../utils/mailClient")
const { ADMIN_SECRET, FORGOT_PASSWORD_TOKEN } = require("../../../utils/keys")

module.exports = {
  async LoginAdmin(_, { email, password }) {
    try {
      const { error } = loginValidation({ email, password })
      if (error) generateError(error.details[0].message)

      const admin = await Admin.findOne({ email })
      if (!admin) generateError("Admin doesn't exist")

      const passwordMatch = await bcrypt.compare(password, admin.password)
      if (!passwordMatch) generateError("Invalid admin credentials")

      const token = await jwt.sign({ adminId: admin._id }, ADMIN_SECRET, {
        expiresIn: "24h",
      })

      return {
        token,
        admin: admin._id.toString(),
      }
    } catch (e) {
      throw e
    }
  },
  AllNotifications: async (_, { adminId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const notifications = await Notification.find().sort({ _id: -1 })
      return notifications.map((notification) =>
        notificationReducer(notification)
      )
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
  AllShortTermProductRecords: async (_, { adminId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const records = await ProductRecords.find({
        productType: "Short-term",
      }).sort({ _id: -1 })
      return records.map((record) => productRecordReducer(record))
    } catch (e) {
      throw e
    }
  },
}
