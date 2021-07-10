const bcrypt = require("bcrypt")

const Client = require("../../../models/Client")
const { registerValidation } = require("../../../helpers/validations")
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
      if (!passwordPattern_1.test(password) || passwordPattern_2.test(password))
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
}
