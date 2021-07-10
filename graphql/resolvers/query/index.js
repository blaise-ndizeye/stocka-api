const userQueries = require("./user")
const shortTermProductQueries = require("./shortTermProduct")
const longTermProductQueries = require("./longTermProduct")

module.exports = {
  Query: {
    ...userQueries,
    ...shortTermProductQueries,
    ...longTermProductQueries,
  },
}
