const bcrypt = require("bcrypt")

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

module.exports = {
  RegisterClient: async (_, { client }) => {
    const { username, email, phone, password, confirmPassword, role, gender } =
      client
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
    { clientId, oldPassword, newPassword },
    { auth }
  ) => {
    try {
      const { clientId: client, isLoggedIn, message } = await auth
      if (!isLoggedIn || client !== clientId) generateError(message)

      const clientExists = await Client.findOne({ _id: clientId })
      if (!clientExists) generateError(message)

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
}
