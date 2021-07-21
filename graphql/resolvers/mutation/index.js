const adminMutations = require("./admin")
const userMutations = require("./user")
const shortTermProductMutations = require("./shortTermProduct")
const longTermProductMutations = require("./longTermProduct")
const productRecordMutations = require("./productRecord")

module.exports = {
  Mutation: {
    // All mutations will be imported here
    ...adminMutations,
    ...userMutations,
    ...shortTermProductMutations,
    ...longTermProductMutations,
    ...productRecordMutations,
  },
}
