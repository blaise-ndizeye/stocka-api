module.exports = {
  passwordPattern_1: /[a-zA-Z]/,
  passwordPattern_2: /[0-9]/,
  generateError(errMsg) {
    throw new Error(errMsg)
  },
  passwordValidation: (passwords) => {
    const passwordPattern_1 = /[a-zA-Z]/
    const passwordPattern_2 = /[0-9]/
    const { password, confirmPassword } = passwords
    if (password !== confirmPassword)
      throw new Error("Both passwords must be the same")
    if (password.length < 6)
      throw new Error("Password must have at least six characters")
    if (!passwordPattern_1.test(password) || !passwordPattern_2.test(password))
      throw new Error("Password must include letters and numbers")
  },
  newDate: (dateObj, numOfDays) => {
    dateObj.setDate(dateObj.getDate() + numOfDays)
    return dateObj
  },
  adminAccRecover: {
    email: `admin@stocka.com`,
    password: `admin1@graph`,
    username: "Stocka Admin",
    gender: "Male",
    phone: "0787657134",
  },
}
