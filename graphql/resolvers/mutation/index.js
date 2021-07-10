const userMutations = require("./user")
const shortTermProductMutations = require("./shortTermProduct")
const longTermProductMutations = require("./longTermProduct")

module.exports = {
  Mutation: {
    // All mutations will be imported here
    ...userMutations,
    ...shortTermProductMutations,
    ...longTermProductMutations,
  },
}
