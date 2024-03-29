const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Client = require("../../../models/Client")
const Notification = require("../../../models/Notification")
const Payment = require("../../../models/Payment")

const {
  loginValidation,
  emailValidation,
} = require("../../../helpers/validations")
const {
  notificationReducer,
  paymentReducer,
} = require("../../../helpers/reducers")
const { generateError } = require("../../../utils/constants")
const sendMail = require("../../../utils/mailClient")
const { TOKEN_SECRET, FORGOT_PASSWORD_TOKEN } = require("../../../utils/keys")

module.exports = {
  LoginClient: async (_, { email, password }) => {
    try {
      const { error } = loginValidation({ email, password })
      if (error) generateError(error.details[0].message)

      const client = await Client.findOne({ email })
      if (!client) generateError("User doesn't exist")

      const passwordMatch = await bcrypt.compare(password, client.password)
      if (!passwordMatch) generateError("Invalid user credentials")

      const token = await jwt.sign({ clientId: client._id }, TOKEN_SECRET, {
        expiresIn: "72h",
      })

      return {
        token,
        client: client._id.toString(),
      }
    } catch (e) {
      throw e
    }
  },
  ForgotPassword: async (_, { email }) => {
    try {
      const { error } = emailValidation({ email })
      if (error) generateError(error.details[0].message)

      const userExists = await Client.findOne({ email })
      if (!userExists) generateError("Invalid credentials")

      const secret = FORGOT_PASSWORD_TOKEN + userExists.password
      const { password, _id } = userExists
      let resetToken = await jwt.sign({ clientId: _id, password }, secret, {
        expiresIn: "2h",
      })
      resetToken = `${resetToken}___${_id}`
      const status = await sendMail({
        emailTo: userExists.email,
        resetToken,
        userType: "user",
      })
      if (!status.success) generateError(status.message)
      return {
        success: true,
        email,
        message: `The link to reset the password sent to email: ${email} and is valid for two hours`,
      }
    } catch (e) {
      throw e
    }
  },
  Notifications: async (_, { clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const paymentStatus = await Payment.findOne({ clientId })

      const notifications = await Notification.find({
        $or: [
          { destination: clientId },
          {
            destination: paymentStatus.paid ? "PAID USERS" : "UNPAID USERS",
          },
          { destination: "ALL USERS" },
        ],
      }).sort({
        _id: -1,
      })
      return notifications.map((notification) =>
        notificationReducer(notification)
      )
    } catch (e) {
      throw e
    }
  },
  PaymentStatus: async (_, { clientId }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const paymentStatus = await Payment.findOne({ clientId })
      return paymentReducer(paymentStatus)
    } catch (e) {
      throw e
    }
  },
}
