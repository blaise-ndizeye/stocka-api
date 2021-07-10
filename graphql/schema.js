const { gql } = require("apollo-server")

const typeDefs = gql`
  type ClientLoginResponse {
    "the response to the client when he or she logs in and the client is the nested query"
    token: String!
    client: Client!
  }

  input ClientCreds {
    "The input fields required for registering the user"
    username: String!
    email: String!
    phone: String!
    password: String!
    confirmPassword: String!
    role: Role!
    gender: String!
  }

  input ShortTermProductCreds {
    "the input values required for short-term-products and if no description value set it to = No description"
    name: String!
    buyingPrice: Float!
    amount: Float!
    pricePerUnit: Float!
    description: String
    dateOfExpry: String!
  }

  input LongTermProductCreds {
    "the input values reuired for long-term-products and if no description value set it to = No description"
    name: String!
    buyingPrice: Float!
    amount: Float!
    pricePerUnit: Float!
    description: String
  }

  type LongTermProduct {
    "the product which last for long time means it have no date-of-expry"
    productId: ID!
    name: String!
    buyingPrice: Float!
    amount: Float!
    pricePerUnit: Float!
    dateOfEntry: String!
    description: String
    client: Client!
  }

  type ShortTermProduct {
    "the product which last for short time means which have the date-of-expry"
    productId: ID!
    name: String!
    buyingPrice: Float!
    amount: Float!
    pricePerUnit: Float!
    dateOfEntry: String!
    description: String
    dateOfExpry: String!
    client: Client!
  }

  enum Role {
    "The values must be between the below ones"
    USER
    ADMIN
  }

  type Client {
    "the fields for the the client or current user of the app and they include the nested queries"
    clientId: ID!
    username: String!
    email: String!
    phone: String!
    role: Role!
    active: Boolean!
    gender: String!
    createdAt: String!
    shortTermProducts: [ShortTermProduct!]!
    longTermProducts: [LongTermProduct!]!
    shortTermProductsRecords: [ProductRecord!]!
    LongTermProductsRecords: [ProductRecord!]!
  }

  type ProductRecord {
    "the fields to be returned for the product record"
    client: Client!
    name: String!
    productType: String!
    buyingPrice: Float!
    sellingPrice: Float!
    amount: Float!
    dateOfEntry: String!
    dateRecorderd: String!
    description: String
  }

  type DeleteProductResponse {
    "The response after deletion of the product will look like this"
    success: Boolean!
    message: String!
    product: ID!
  }

  type Query {
    "all query types will require Authorization tike the mutations except the LoginClient query where the client will get the authorization key and set asthe header key as Authorization and value as Bearer token and it last for 3 days"
    LoginClient(
      "Login to the app with valid credentials and get the token with the user"
      email: String!
      password: String!
    ): ClientLoginResponse!
    ShortTermProducts(
      "Get all short-term products sorted according to LIFO principle"
      clientId: ID!
    ): [ShortTermProduct!]!
    LongTermProducts(
      "Get all long-term products sorted according to LIFO principle"
      clientId: ID!
    ): [LongTermProduct!]!
    OneShortTermProduct(
      "Get one short-term product but for development purpose"
      clientId: ID!
      productId: ID!
    ): ShortTermProduct!
    OneLongTermProduct(
      "Get one long-term product but for development purpose"
      clientId: ID!
      productId: ID!
    ): LongTermProduct!
    LongTermProductsRecords(
      "Get all long-term products records"
      clientId: ID!
      productType: String!
    ): [ProductRecord!]!
    ShortTermProductRecords(
      "Get all short-term product records"
      clientId: ID!
      productType: String!
    ): [ProductRecord!]!
  }

  type Mutation {
    "All the mutations requires the user to be authorized by sending the Authorization header with Bearer token value like this = Authorization for the key and Bearer token for value except RegisterClient mutation"
    RegisterClient(
      "Register new client using the below parameters and this is like the current user of the app"
      client: ClientCreds
    ): Client!
    AddShortTermProduct(
      "Add short-term product to the app using the below parameters and are well validated and the date-of-expry must be greater than the today date"
      product: ShortTermProductCreds
      clientId: ID!
    ): ShortTermProduct!
    UpdateShortTermProduct(
      "Update short-term product values and all fields are required to be sent so as to store them efficiently and remember the rules for date-of-expry"
      product: ShortTermProductCreds
      clientId: ID!
      productId: ID!
    ): ShortTermProduct!
    DeleteShortTermProduct(
      "Delete short-term product from the app it requires selling price so as to be recorded if you haven't send zero as default value"
      clientId: ID!
      productId: ID!
      sellingPrice: Float!
    ): DeleteProductResponse!
    AddLongTermProduct(
      "Add long-term product to the app using the below parameters and are well validated and no date-of-expry for this product"
      product: LongTermProductCreds
      clientId: ID!
    ): LongTermProduct!
    UpdateLongTermProduct(
      "Update long-term product to the app using the below parameters and all are required to be sent so as to be stoerd efficiently"
      product: LongTermProductCreds
      clientId: ID!
      productId: ID!
    ): LongTermProduct!
    DeleteLongTermProduct(
      "Delete long-term product from the app it requires the selling price so as to be recorded if you haven't send zero as default value"
      clientId: ID!
      productId: ID!
      sellingPrice: Float!
    ): DeleteProductResponse!
  }
`

module.exports = typeDefs
