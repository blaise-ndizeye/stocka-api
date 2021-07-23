const jwt = require("jsonwebtoken")

const Admin = require("../../models/Admin")
const { ADMIN_SECRET } = require("../../utils/keys")

module.exports = async (req) => {
  const header = req.header("Security")

  if (!header)
    return {
      adminId: null,
      isLoggedIn: false,
      message: "Access Denied, not authorized: jwt doesn't exist",
    }

  try {
    const token = header.split(" ")[1]
    const tokenData = jwt.verify(token, ADMIN_SECRET)
    const admin = await Admin.findOne({ _id: tokenData.adminId })
    if (!admin)
      return {
        adminId: null,
        isLoggedIn: false,
        message: "Access Denied, not authorized",
      }

    return {
      adminId: admin.id,
      isLoggedIn: true,
      message:
        "Access granted: make sure about the admin credentials being used",
    }
  } catch (e) {
    return {
      adminId: null,
      isLoggedIn: false,
      message: `Access Denied, not authorized: ${e.message}`,
    }
  }
}
