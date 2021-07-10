const jwt = require("jsonwebtoken")

const Client = require("../../models/Client")
const { TOKEN_SECRET } = require("../../utils/keys")
const { generateError } = require("../../utils/constants")

module.exports = async (req) => {
  const header = req.header("Authorization")

  if (!header)
    return {
      clientId: null,
      isLoggedIn: false,
    }

  try {
    const token = header.split(" ")[1]
    const tokenData = jwt.verify(token, TOKEN_SECRET)
    const client = await Client.findOne({ _id: tokenData.clientId })
    if (!client)
      return {
        clientId: null,
        isLoggedIn: false,
      }

    return {
      clientId: client.id,
      active: client.active,
      isLoggedIn: true,
    }
  } catch (e) {
    generateError(e)
  }
}
