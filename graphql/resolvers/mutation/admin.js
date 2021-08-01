const bcrypt = require("bcrypt")

const Admin = require("../../../models/Admin")
const Client = require("../../../models/Client")
const Notification = require("../../../models/Notification")
const Payment = require("../../../models/Payment")
const Status = require("../../../models/Status")

const {
  adminValidation,
  notificationValidation,
  emailValidation,
} = require("../../../helpers/validations")
const { adminReducer } = require("../../../helpers/reducers")
const {
  generateError,
  passwordValidation,
  adminAccRecover,
} = require("../../../utils/constants")

module.exports = {
  RegisterAdmin: async (_, { admin }) => {
    try {
      const { name, email, phone, gender, password, confirmPassword } = admin
      passwordValidation({ password, confirmPassword })

      const { error } = adminValidation({
        name,
        email,
        phone,
        gender,
        password,
      })
      if (error) generateError(error.details[0].message)

      const adminExists = await Admin.find()
      if (
        adminExists.length > 0 &&
        adminExists[0].email !== adminAccRecover.email
      )
        generateError("Admin already exists")

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      if (adminExists[0].email === adminAccRecover.email) {
        await Admin.updateOne(
          { _id: adminExists[0]._id },
          {
            username: name,
            email,
            phone,
            gender,
            password: hashedPassword,
          }
        )
        const updatedAdmin = await Admin.findOne({ email })
        return adminReducer(updatedAdmin)
      }
      const newAdmin = await new Admin({
        username: name,
        email,
        phone,
        gender,
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
            { source: "ADMIN" },
            { message: notification },
            { clientId: clientObj._id },
          ],
        })
        if (notifications.length > 0) continue
        await new Notification({
          source: "ADMIN",
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
            { source: "ADMIN" },
            { message: notification },
            { clientId: clientObjId },
          ],
        })
        if (notifications.length > 0) continue
        await new Notification({
          source: "ADMIN",
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
            { source: "ADMIN" },
            { message: notification },
            { clientId: clientObjId },
          ],
        })
        if (notifications.length > 0) continue
        await new Notification({
          source: "ADMIN",
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
        $and: [{ source: "ADMIN" }, { message: notification }, { clientId }],
      })
      if (notificationExist.length > 0)
        generateError("The notification being sent already exists")
      await new Notification({
        source: "ADMIN",
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
  async AdminDeleteNotification(_, { adminId, notificationId }, { secure }) {
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
  AdminUpdateCredentials: async (
    _,
    { adminId, username, phone, gender, email, password },
    { secure }
  ) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const adminExists = await Admin.findOne({ _id: adminId })
      if (!adminExists) generateError(message)

      if (email === adminAccRecover.email)
        generateError("The email specified is not allowed")
      if (adminExists.email === adminAccRecover.email)
        generateError("Failed to update the account credentials")
      const { error } = adminValidation({
        name: username,
        phone,
        email,
        gender,
        password,
      })
      if (error) generateError(error.details[0].message)

      const passwordMatch = await bcrypt.compare(password, adminExists.password)
      if (!passwordMatch) generateError("Invalid Password")

      await Admin.updateOne(
        { _id: adminId },
        {
          $set: {
            username,
            email,
            phone,
            gender,
          },
        }
      )
      const updatedAdmin = await Admin.findOne({ _id: adminId })
      return adminReducer(updatedAdmin)
    } catch (e) {
      throw e
    }
  },
  AdminUpdatePassword: async (
    _,
    { adminId, oldPassword, newPassword, confirmPassword },
    { secure }
  ) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const adminExists = await Admin.findOne({ _id: adminId })
      if (!adminExists) generateError(message)

      passwordValidation({ password: newPassword, confirmPassword })

      const passwordMatch = await bcrypt.compare(
        oldPassword,
        adminExists.password
      )
      if (!passwordMatch) generateError("Invalid Password")

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      await Admin.updateOne(
        { _id: adminId },
        {
          $set: {
            password: hashedPassword,
          },
        }
      )
      const updatedAdmin = await Admin.findOne({ _id: adminId })
      return adminReducer(updatedAdmin)
    } catch (e) {
      throw e
    }
  },
  AdminSetCost: async (_, { adminId, premiumCost, duration }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      if (premiumCost < 1) generateError("Invalid premium cost")
      if (duration <= 0) generateError("Invalid duration")

      const findPremium = await Status.findOne({
        $or: [{ premiumCost }, { duration }],
      })
      if (findPremium)
        generateError("The premium with that cost/duration is already set")

      const status = await new Status({ premiumCost, duration }).save()
      return {
        success: true,
        message: "The premium cost set successfully",
        premiumId: status.id,
      }
    } catch (e) {
      throw e
    }
  },
  AdminUpdateCost: async (
    _,
    { adminId, premiumId, newPremiumCost, newDuration },
    { secure }
  ) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      if (newPremiumCost < 1) generateError("Invalid premium cost")
      if (newDuration <= 0) generateError("Invalid duration")

      const findStatus = await Status.findOne({ _id: premiumId })
      if (!findStatus) generateError("The premium cost to update not found")

      await Status.updateOne(
        { _id: premiumId },
        {
          $set: {
            premiumCost: newPremiumCost,
            duration: !newDuration ? findStatus.duration : newDuration,
          },
        }
      )
      return {
        success: true,
        message: "The premium cost updated successfully",
        premiumId,
      }
    } catch (e) {
      throw e
    }
  },
  AdminDeleteCost: async (_, { adminId, premiumId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const findStatus = await Status.findOne({ _id: premiumId })
      if (!findStatus) generateError("The status to delete not found")

      await Status.deleteOne({ _id: premiumId })
      return {
        success: true,
        message: "The premium cost deleted successfully",
        premiumId,
      }
    } catch (e) {
      throw e
    }
  },
  ToggleClientActivation: async (_, { adminId, clientId }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const client = await Client.findOne({ _id: clientId })
      const payment = await Payment.findOne({ clientId })

      if (!client) generateError("Client doesn't exist")
      if (payment.paid && client.active)
        generateError("Failed to deactivate the paid client")

      await Client.updateOne(
        { _id: clientId },
        {
          $set: {
            active: !client.active,
          },
        }
      )
      return {
        success: true,
        message: "The client activation toggled successfully",
        client: clientId,
      }
    } catch (e) {
      throw e
    }
  },
  AdminDeleteAccount: async (_, { adminId, confirmPassword }, { secure }) => {
    try {
      const { adminId: admin, isLoggedIn, message } = await secure
      if (!isLoggedIn || admin !== adminId) generateError(message)

      const findAdmin = await Admin.findOne({ _id: adminId })
      const passwordMatch = await bcrypt.compare(
        confirmPassword,
        findAdmin.password
      )
      if (!passwordMatch) generateError("Invalid Password")

      const { email, password, username, gender, phone } = adminAccRecover
      const hashedPassword = await bcrypt.hash(password, 10)
      await Admin.updateOne(
        { _id: adminId },
        {
          $set: {
            username,
            phone,
            gender,
            email,
            password: hashedPassword,
          },
        }
      )
      return {
        success: true,
        message: "Account deleted successfully",
        accountId: adminId,
      }
    } catch (e) {
      throw e
    }
  },
}
