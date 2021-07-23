const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Admin = require("../../../models/Admin")
const Notification = require("../../../models/Notification")
const Payment = require("../../../models/Payment")
const Status = require("../../../models/Status")

const {
  loginValidation,
  emailValidation,
} = require("../../../helpers/validations")

const {
  notificationReducer,
  paymentReducer,
  premiumReducer,
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
      if (!admin) generateError("Invalid credentials")

      const passwordMatch = await bcrypt.compare(password, admin.password)
      if (!passwordMatch) generateError("Invalid credentials")

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
  AdminForgotPassword: async (_, { email }) => {
    try {
      const { error } = emailValidation({ email })
      if (error) generateError(error.details[0].message)

      const adminExists = await Admin.findOne({ email })
      if (!adminExists) generateError("Invalid credentials")

      const secret = FORGOT_PASSWORD_TOKEN + adminExists.password
      const { password, _id } = adminExists
      let resetToken = await jwt.sign({ adminId: _id, password }, secret, {
        expiresIn: "1h",
      })
      resetToken = `${resetToken}___${_id}`
      const status = await sendMail({
        emailTo: adminExists.email,
        resetToken,
        userType: "admin",
      })
      if (!status.success) generateError(status.message)
      return {
        success: true,
        email,
        message: `The link to reset the password sent to email: ${email} and is valid for one hour`,
      }
    } catch (e) {
      throw e
    }
  },
  AllPayments: async (_, { adminId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const payments = await Payment.find().sort({ _id: -1 })
      return payments.map((payment) => paymentReducer(payment))
    } catch (e) {
      throw e
    }
  },
  AllPremiums: async (_, { adminId, clientId }, { secure, auth }) => {
    try {
      const {
        adminId: admin,
        isLoggedIn: adminLoggedIn,
        message: adminMsg,
      } = await secure
      const {
        clientId: client,
        isLoggedIn: clientLoggedIn,
        message: clientMsg,
      } = await auth

      const condition = !clientId
        ? !adminLoggedIn || admin !== adminId
        : !clientLoggedIn || client !== clientId
      const message = !clientId ? adminMsg : clientMsg

      if (condition) generateError(message)

      const premiums = await Status.find().sort({ _id: -1 })
      return premiums.map((premium) => premiumReducer(premium))
    } catch (e) {
      throw e
    }
  },
}
