const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Admin = require("../../../models/Admin")

const {
  loginValidation,
  emailValidation,
} = require("../../../helpers/validations")

const { generateError } = require("../../../utils/constants")
const { ADMIN_SECRET, FORGOT_PASSWORD_TOKEN } = require("../../../utils/keys")
const sendMail = require("../../../utils/mailClient")

module.exports = {
  async LoginAdmin(_, { email, password }) {
    try {
      const { error } = loginValidation({ email, password })
      if (error) generateError(error.details[0].message)

      const admin = await Admin.findOne({ email })
      if (!admin) generateError("Admin doesn't exist")

      const passwordMatch = await bcrypt.compare(password, admin.password)
      if (!passwordMatch) generateError("Invalid admin credentials")

      const token = await jwt.sign({ adminId: admin._id }, ADMIN_SECRET, {
        expiresIn: "24h",
      })

      return {
        token,
        admin: admin._id.toString(),
      }
    } catch (e) {
      throw e
    }
  },
}
