const bcrypt = require("bcrypt")

const Admin = require("../../../models/Admin")
const Client = require("../../../models/Client")
const Notification = require("../../../models/Notification")

const {
  adminValidation,
  notificationValidation,
} = require("../../../helpers/validations")
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

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newAdmin = await new Admin({
        username: name,
        email,
        phone,
        password: hashedPassword,
      }).save()
      return adminReducer(newAdmin)
    } catch (e) {
      throw e
    }
  },
  async NotifyAllClients(_, { adminId, message: notification }, { secure }) {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const { error } = notificationValidation({ message: notification })
      if (error) generateError(error.details[0].message)

      const clients = await Client.find()
      for (let i in clients) {
        let clientObj = clients[i]
        let notifications = await Notification.find({
          $and: [
            { adminId },
            { message: notification },
            { clientId: clientObj._id },
          ],
        })
        if (notifications.length > 0) continue
        await new Notification({
          adminId,
          clientId: clientObj._id,
          message: notification,
        }).save()
      }
      const adminObj = await Admin.findOne({ _id: adminId })
      return {
        success: true,
        message: "The notification successfully sent to all clients",
        admin: adminReducer(adminObj),
      }
    } catch (e) {
      throw e
    }
  },
}
