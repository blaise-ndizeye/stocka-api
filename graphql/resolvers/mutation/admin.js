const bcrypt = require("bcrypt")

const Admin = require("../../../models/Admin")
const Client = require("../../../models/Client")
const Notification = require("../../../models/Notification")
const Payment = require("../../../models/Payment")

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
  async NotifyPaidClients(_, { adminId, message: notification }, { secure }) {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const { error } = notificationValidation({ message: notification })
      if (error) generateError(error.details[0].message)
      const adminObj = await Admin.findOne({ _id: adminId })

      const paidPayments = await Payment.find({ paid: true })
      if (paidPayments.length < 1)
        return {
          success: false,
          message: "There are no paid clients to notify",
          admin: adminReducer(adminObj),
        }
      for (let i in paidPayments) {
        let clientObjId = paidPayments[i].clientId

        let notifications = await Notification.find({
          $and: [
            { adminId },
            { message: notification },
            { clientId: clientObjId },
          ],
        })
        if (notifications.length > 0) continue
        await new Notification({
          adminId,
          clientId: clientObjId,
          message: notification,
        }).save()
      }

      return {
        success: true,
        message: "The notification successfully sent to paid clients",
        admin: adminReducer(adminObj),
      }
    } catch (e) {
      throw e
    }
  },
  async NotifyUnPaidClients(_, { adminId, message: notification }, { secure }) {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const { error } = notificationValidation({ message: notification })
      if (error) generateError(error.details[0].message)
      const adminObj = await Admin.findOne({ _id: adminId })

      const unPaidPayments = await Payment.find({ paid: false })
      if (unPaidPayments.length < 1)
        return {
          success: false,
          message: "There are no unpaid clients to notify",
          admin: adminReducer(adminObj),
        }
      for (let i in unPaidPayments) {
        let clientObjId = unPaidPayments[i].clientId

        let notifications = await Notification.find({
          $and: [
            { adminId },
            { message: notification },
            { clientId: clientObjId },
          ],
        })
        if (notifications.length > 0) continue
        await new Notification({
          adminId,
          clientId: clientObjId,
          message: notification,
        }).save()
      }

      return {
        success: true,
        message: "The notification successfully sent to unpaid clients",
        admin: adminReducer(adminObj),
      }
    } catch (e) {
      throw e
    }
  },
  async NotifyOneClient(
    _,
    { adminId, clientId, message: notification },
    { secure }
  ) {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)
      const adminObj = await Admin.findOne({ _id: adminId })
      const clientObj = await Client.findOne({ _id: clientId })
      if (!clientObj) generateError("Client doesn't exist")

      const { error } = notificationValidation({ message: notification })
      if (error) generateError(error.details[0].message)

      let notificationExist = await Notification.find({
        $and: [{ adminId }, { message: notification }, { clientId }],
      })
      if (notificationExist.length > 0)
        generateError("The notification being sent already exists")
      await new Notification({
        adminId,
        clientId,
        message: notification,
      }).save()

      return {
        success: true,
        message: `The notification successfully sent to selected client: ${clientObj.email}`,
        admin: adminReducer(adminObj),
      }
    } catch (e) {
      throw e
    }
  },
  async DeleteNotification(_, { adminId, notificationId }, { secure }) {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      await Notification.deleteOne({ _id: notificationId })
      return {
        success: true,
        message: "The notification deleted successfully",
        notificationId,
      }
    } catch (e) {
      throw e
    }
  },
  AdminResetPassword: async (_, { token, newPassword, confirmPassword }) => {
    const tokenData = token.split("___")
    const admin = await Admin.findOne({ _id: tokenData[1] })
    if (!admin) generateError("Invalid credentials")

    try {
      await jwt.verify(tokenData[0], FORGOT_PASSWORD_TOKEN + admin.password)

      passwordValidation({ password: newPassword, confirmPassword })

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      await Admin.updateOne(
        { _id: admin._id },
        {
          $set: {
            password: hashedPassword,
          },
        }
      )
      return {
        success: true,
        email: admin.email,
        message: "Password updated successfully",
      }
    } catch (e) {
      throw e
    }
  },
}
