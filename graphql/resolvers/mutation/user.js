const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Client = require("../../../models/Client")
const {
  registerValidation,
  emailValidation,
} = require("../../../helpers/validations")
const { clientReducer } = require("../../../helpers/reducers")
const {
  passwordPattern_1,
  passwordPattern_2,
  generateError,
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

      return clientReducer(newClient)
    } catch (e) {
      throw e
    }
  },
  UpdateUsername: async (_, { clientId, username, password }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const clientExists = await Client.findOne({ _id: clientId })
      if (!clientExists) generateError(message)

      if (typeof username !== "string" || username.length < 3)
        generateError("Username must be valid and have minimum length of three")

      if (!password || password.length < 6)
        generateError("Password must have at least six characters")

      if (
        !passwordPattern_1.test(password) ||
        !passwordPattern_2.test(password)
      )
        generateError("Password must contain numbers and letters")

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
          },
        }
      )
      const updatedClient = await Client.findOne({ _id: clientId })
      return clientReducer(updatedClient)
    } catch (e) {
      throw e
    }
  },
  UpdateEmail: async (_, { clientId, email, password }, { auth }) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const clientExists = await Client.findOne({ _id: clientId })
      if (!clientExists) generateError(message)

      const { error } = emailValidation({ email })
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
            email,
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
}
