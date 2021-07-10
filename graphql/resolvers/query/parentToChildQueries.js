const { client: findClient } = require("../../../helpers/findFunctions")

module.exports = {
  ClientLoginResponse: {
    client: (parent) => findClient(parent),
  },
  ShortTermProduct: {
    client: (parent) => findClient(parent),
  },
  LongTermProduct: {
    client: (parent) => findClient(parent),
  },
  ProductRecord: {
    client: (parent) => findClient(parent),
  },
}
