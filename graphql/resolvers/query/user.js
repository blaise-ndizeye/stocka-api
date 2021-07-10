const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Client = require("../../../models/Client")

const { loginValidation } = require("../../../helpers/validations")
const { generateError } = require("../../../utils/constants")
const { TOKEN_SECRET } = require("../../../utils/keys")

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
}
