const bcrypt = require("bcrypt")

const Admin = require("../../../models/Admin")

const { adminValidation } = require("../../../helpers/validations")
const { adminReducer } = require("../../../helpers/reducers")
const {
  generateError,
  passwordValidation,
} = require("../../../utils/constants")

module.exports = {
  RegisterAdmin: async (_, { admin }) => {
    try {
      const { name, email, phone, password, confirmPassword } = admin
      passwordValidation({ password, confirmPassword })

      const { error } = adminValidation({ name, email, phone, password })
      if (error) generateError(error.details[0].message)
      
      const adminExists = await Admin.findOne({ email })
      if (adminExists) generateError("Admin already exists")

      const salt =  await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newAdmin = await new Admin({
        username: name,
        email,
        phone,
        password: hashedPassword
      }).save()
      return adminReducer(newAdmin)
    } catch (e) {
      throw e
    }
  },
}
