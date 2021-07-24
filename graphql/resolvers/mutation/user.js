const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Client = require("../../../models/Client")
const Payment = require("../../../models/Payment")
const ShortTermProduct = require("../../../models/ShortTermProduct")
const LongTermProduct = require("../../../models/LongTermProduct")
const Notification = require("../../../models/Notification")

const {
  registerValidation,
  emailValidation,
} = require("../../../helpers/validations")
const { clientReducer } = require("../../../helpers/reducers")
const {
  passwordPattern_1,
  passwordPattern_2,
  generateError,
  newDate,
} = require("../../../utils/constants")
const { FORGOT_PASSWORD_TOKEN } = require("../../../utils/keys")

module.exports = {
  RegisterClient: async (_, { client }) => {
    const { email, password, confirmPassword } = client
    try {
      const clientExists = await Client.findOne({ email })

      if (clientExists) generateError("User already exists")
      const { error } = registerValidation(client)
      if (password !== confirmPassword)
        generateError("Both passwords must be the same")
      if (error) generateError(error.details[0].message)
      if (
        !passwordPattern_1.test(password) ||
        !passwordPattern_2.test(password)
      )
        generateError("Password must include letters and numbers")

      const hashedPassword = await bcrypt.hash(password, 10)

      const newClient = await new Client({
        ...client,
        password: hashedPassword,
        active: true,
      }).save()

      await new Payment({
        clientId: newClient._id,
        paid: true,
        refund: 0,
        expryDate: newDate(new Date(), 15),
      }).save()

      return clientReducer(newClient)
    } catch (e) {
      throw e
    }
  },
  UpdateCredentials: async (
    _,
    { clientId, username, email, phone, gender, password },
    { auth }
  ) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const clientExists = await Client.findOne({ _id: clientId })
      if (!clientExists) generateError(message)

      const { error } = registerValidation({
        username,
        email,
        phone,
        gender,
        password,
        confirmPassword: password,
      })
      if (error) generateError(error.details[0].message)

      const passwordMatch = await bcrypt.compare(
        password,
        clientExists.password
      )
      if (!passwordMatch) generateError("Invalid Password")

      await Client.updateOne(
        { _id: clientId },
        {
          $set: {
            username,
            email,
            phone,
            gender,
          },
        }
      )
      const updatedClient = await Client.findOne({ _id: clientId })
      return clientReducer(updatedClient)
    } catch (e) {
      throw e
    }
  },
  UpdatePassword: async (
    _,
    { clientId, oldPassword, newPassword, confirmPassword },
    { auth }
  ) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const clientExists = await Client.findOne({ _id: clientId })
      if (!clientExists) generateError(message)
      if (newPassword !== confirmPassword)
        generateError("New Password must equal to Confirm Password")
      if (!newPassword || newPassword.length < 6)
        generateError("Password must have at least six characters")

      if (
        !passwordPattern_1.test(newPassword) ||
        !passwordPattern_2.test(newPassword)
      )
        generateError("Password must contain numbers and letters")

      const passwordMatch = await bcrypt.compare(
        oldPassword,
        clientExists.password
      )
      if (!passwordMatch) generateError("Invalid Password")

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      await Client.updateOne(
        { _id: clientId },
        {
          $set: {
            password: hashedPassword,
          },
        }
      )
      const updatedClient = await Client.findOne({ _id: clientId })
      return clientReducer(updatedClient)
    } catch (e) {
      throw e
    }
  },
  ResetPassword: async (_, { token, newPassword, confirmPassword }) => {
    const tokenData = token.split("___")
    const client = await Client.findOne({ _id: tokenData[1] })
    if (!client) generateError("Invalid credentials")

    try {
      await jwt.verify(tokenData[0], FORGOT_PASSWORD_TOKEN + client.password)

      if (newPassword !== confirmPassword)
        generateError("Passwords must be the same")
      if (!newPassword || newPassword.length < 6)
        generateError("Password must have at least six characters")

      if (
        !passwordPattern_1.test(newPassword) ||
        !passwordPattern_2.test(newPassword)
      )
        generateError("Password must contain numbers and letters")

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      await Client.updateOne(
        { _id: client._id },
        {
          $set: {
            password: hashedPassword,
          },
        }
      )
      return {
        success: true,
        email: client.email,
        message: "Password updated successfully",
      }
    } catch (e) {
      throw e
    }
  },
  DeleteAccount: async (_, { clientId, confirmPassword }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const paymentStatus = await Payment.findOne({ clientId })
      if (paymentStatus && !paymentStatus.paid)
        generateError(
          "Please pay for the premium to be able to perform this operation"
        )

      const clientExists = await Client.findOne({ _id: clientId })
      const passwordMatch = await bcrypt.compare(
        confirmPassword,
        clientExists.password
      )
      if (!passwordMatch) generateError("Invalid Password")

      const delShortTermProducts = ShortTermProduct.deleteMany({ clientId })
      const delLongTermProducts = LongTermProduct.deleteMany({ clientId })
      const delPayment = Payment.deleteMany({ clientId })
      const delNotification = Notification.deleteMany({ clientId })
      const delAcc = Client.deleteOne({ _id: clientId })

      await Promise.all([
        delShortTermProducts,
        delLongTermProducts,
        delPayment,
        delNotification,
        delAcc,
      ])
      return {
        success: true,
        message: "Account deleted successfully",
        accountId: clientId,
      }
    } catch (e) {
      throw e
    }
  },
}
