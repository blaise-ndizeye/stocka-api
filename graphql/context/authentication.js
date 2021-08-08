const jwt = require("jsonwebtoken")

const Client = require("../../models/Client")
const { TOKEN_SECRET } = require("../../utils/keys")

module.exports = async (req) => {
  const header = req.header("Authorization")

  if (!header)
    return {
      clientId: null,
      isLoggedIn: false,
      message: "Access Denied, not authorized: jwt doesn't exist",
    }

  try {
    const token = header.split(" ")[1]
    const tokenData = jwt.verify(token, TOKEN_SECRET)
    const client = await Client.findOne({ _id: tokenData.clientId })
    if (!client)
      return {
        clientId: null,
        isLoggedIn: false,
        message: "Access Denied, not authorized",
      }
    if (!client.active)
      return {
        clientId: client._id,
        isLoggedIn: false,
        message: "Access Denied, please activate your account",
      }

    return {
      clientId: client.id,
      active: client.active,
      isLoggedIn: true,
      message:
        "Access granted: make sure about the client credentials being used",
    }
  } catch (e) {
    return {
      clientId: null,
      isLoggedIn: false,
      message: `Access Denied, not authorized: ${e.message}`,
    }
  }
}
