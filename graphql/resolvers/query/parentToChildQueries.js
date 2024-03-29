const {
  client: findClient,
  admin: findAdmin,
  shortTermProducts,
  shortTermProductsRecords,
  longTermProducts,
  longTermProductsRecords,
} = require("../../../helpers/findFunctions")

module.exports = {
  ClientLoginResponse: {
    client: (parent) => findClient(parent),
  },
  AdminLoginResponse: {
    admin: (parent) => findAdmin(parent),
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
  Client: {
    shortTermProducts: (parent) => shortTermProducts(parent),
    longTermProducts: (parent) => longTermProducts(parent),
    shortTermProductRecords: (parent) => shortTermProductsRecords(parent),
    longTermProductRecords: (parent) => longTermProductsRecords(parent),
  },
  Notification: {
    destination: (parent) => findClient(parent),
  },
  Payment: {
    client: (parent) => findClient(parent),
  },
  ActivationResponse: {
    client: (parent) => findClient(parent),
  },
  DestinationResult: {
    __resolveType(obj, _, __) {
      if (obj.clientId || obj.username) return "Client"
      if (obj.destination) return "Destination"
    },
  },
}
