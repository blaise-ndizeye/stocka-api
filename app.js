const { ApolloServer } = require("apollo-server")

const typeDefs = require("./graphql/schema")
const Query = require("./graphql/resolvers/query")
const Mutation = require("./graphql/resolvers/mutation")
const Context = require("./graphql/context")
const NestedQueries = require("./graphql/resolvers/query/nestedQueries")
const connectDB = require("./utils/db")

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
  .listen()
  .then(({ url }) => {
    console.log(`Server is listenning at ${url}`)
  })
  .catch((e) => {
    console.error(`Error occured: ${e}`)
  })
