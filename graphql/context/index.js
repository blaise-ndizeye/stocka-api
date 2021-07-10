const authorize = require("./authentication")

module.exports = (req) => ({
  auth: authorize.call(this, req),
})
