module.exports = {
  passwordPattern_1: /[a-zA-Z]/,
  passwordPattern_2: /0-9/,
  generateError(errMsg) {
    throw new Error(errMsg)
  },
}
