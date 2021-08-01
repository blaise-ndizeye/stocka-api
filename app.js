require("dotenv").config()
const { ApolloServer } = require("apollo-server")

const typeDefs = require("./graphql/schema")
const Query = require("./graphql/resolvers/query")
const Mutation = require("./graphql/resolvers/mutation")
const Context = require("./graphql/context")
const NestedQueries = require("./graphql/resolvers/query/nestedQueries")
const connectDB = require("./utils/db")
const { traceClients, traceProducts } = require("./helpers/traceClients")

connectDB()

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    ...Query,
    ...Mutation,
    ...NestedQueries,
  },
  context: ({ req }) => Context(req),
})

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }) => {
    console.log(`🚀 Server is ready at ${url}`)
    traceClients()
    traceProducts()
  })
  .catch((e) => {
    console.error(`Error occured: ${e}`)
  })
