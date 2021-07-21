const adminQueries = require("./admin")
const userQueries = require("./user")
const shortTermProductQueries = require("./shortTermProduct")
const longTermProductQueries = require("./longTermProduct")

module.exports = {
  Query: {
    ...adminQueries,
    ...userQueries,
    ...shortTermProductQueries,
    ...longTermProductQueries,
  },
}
