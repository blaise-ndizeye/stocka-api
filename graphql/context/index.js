const authorize = require("./authentication")
const security = require("./security")

module.exports = (req) => ({
  auth: authorize.call(this, req),
  secure: security.call(this, req)
})
