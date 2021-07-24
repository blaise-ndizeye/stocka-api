# Stocka graph api documentation

Welcome to this api is constructed based on **GraphQL API Architectural Principles**.
It includes two graphql operations including `mutations, queries` and `Authorization` and `Authentication` using `JasonWebTokens`.

---

> To start the server navigate to the root directory and follow the following steps:

`Navigate in .env file and add the following environment variables:`

###### MONGO_URL = "mongodb://localhost:27017/stocka"

###### TOKEN_SECRET = "**\*\***\***\*\***"

###### FORGOT_PASSWORD_TOKEN = "\***\*\*\*\***"

###### EMAIL = "abc@example.com"

###### PASS = "\***\*\*\***\*\*\*\*\*\*\*\*"

###### CLIENT_URL="https://example.com"

#### Explanation of the above variables:

###### `MONGO_URL`: the database url and it is recommended to be the MONGO DB Url and that one is an example of connecting to a local server

###### `TOKEN_SECRET`: the string specifying the jwt secret and is a string of ypur choice

###### `FORGOT_PASSWORD_TOKEN`: the string specifying the forgot password secret and can be a string of your choice

###### `EMAIL`: the email to be used as the owner of the app in which the app will use when sending different mails to the users

###### `PASS`: the password for the above email

###### `CLIENT_URL`: the root link pointing to the client in which the server is serving to be used when reseting the password for the user

`After entering the above environment variables in the .env file then in the terminal in the current folder run:`

```bash
npm install
```

`After installing the dependencies again in the terminal in the current folder run:`

```bash
node app
```

---

> **Query operations** :>
> `By using the below queries pay attention to the declaration variables.`

###### Every request to the server will require the authorization header with the following key values except `LoginClient` query and `ForgotPassword` query:

`Authorization:` `Bearer token`

The `token` specifies the one returned by the `LoginClient query` and is valid for 3 days

- LoginClient :

```graphql
query ($email: String!, $password: String!) {
  LoginClient(email: $email, password: $password) {
    token
    client {
      clientId
      username
      email
      phone
      role
      active
      gender
    }
  }
}
```

`The are other many properties for the client which can be returned when working in any graphql tool`

- ShortTermProducts :

```graphql
query ($clientId: ID!) {
  ShortTermProducts(clientId: $clientId) {
    productId
    name
    buyingPrice
    amount
    pricePerUnit
    dateOfEntry
    description
    dateOfExpry
    client {
      clientId
      email
      username
    }
  }
}
```

> Noting here the client object will be found in many queries but don't wory it has many properties which will be found in the docs loaded by your grahql tool you prefer

- LongTermProducts :

```graphql
query ($clientId: ID!) {
  LongTermProducts(clientId: $clientId) {
    productId
    name
    buyingPrice
    amount
    pricePerUnit
    dateOfEntry
    description
    client {
      clientId
      username
      email
    }
  }
}
```

- LongTermProductRecords :

```graphql
query ($clientId: ID!) {
  LongTermProductRecords(clientId: $clientId) {
    recordId
    name
    productType
    buyingPrice
    sellingPrice
    amount
    dateOfEntry
    dateRecorded
    description
    client {
      username
      clientId
      email
    }
  }
}
```

- ShortTermProductRecords :

```graphql
query ($clientId: ID!) {
  ShortTermProductRecords(clientId: $clientId) {
    client
    recordId
    name
    productType
    buyingPrice
    sellingPrice
    amount
    dateOfEntry
    dateRecorded
    description
  }
}
```

- ForgotPassword :> `By this query will send the link to the email of the user if it was already registered and also already registered to Gmail client this means which is like this: *****@gmail.com but this issue will be fixed in the future`

```graphql
query ($email: String!) {
  ForgotPassword(email: $email) {
    success
    email
    message
  }
}
```

> **NB:** Once you query the `ForgotPassword` query you may get error if you didn't allow less secure apps feature to your gmail account specified in .env flie Open the link: https://myaccount.google.com/lesssecureapps to enable it if you didn't done that.`

---

> Mutation operations :> `Also pay attention with the variables declaration and almost all variables are very well validated before making any effect to the data stored in the database.`

###### Every request to the server will require the authorization header with the following key values except `RegisterClient` mutation and `ResetPassword` mutation even though this `ResetPassword` mutation will need the token in its arguments:

`Authorization:` `Bearer token`

The `token` specifies the one returned by the `LoginClient query` and is valid for 3 days

- RegisterClient :> `Please respect how the variables are declared by the query if you find any bug find the correction in the docs loaded from the server by your tool`

```graphql
mutation (
  $username: String!
  $email: String!
  $phone: String!
  $password: String!
  $confirmPassword: String!
  $gender: String!
) {
  RegisterClient(
    client: {
      username: $username
      email: $email
      phone: $phone
      password: $password
      confirmPassword: $confirmPassword
      gender: $gender
    }
  ) {
    username
    email
    phone
    role
    active
    createdAt
  }
}
```

- AddShortTermProduct :

```graphql
mutation (
  $buyingPrice: Float!
  $name: String!
  $amount: Float!
  $pricePerUnit: Float!
  $description: String
  $dateOfExpry: String!
  $clientId: ID!
) {
  AddShortTermProduct(
    product: {
      name: $name
      buyingPrice: $buyingPrice
      amount: $amount
      pricePerUnit: $pricePerUnit
      description: $description
      dateOfExpry: $dateOfExpry
    }
    clientId: $clientId
  ) {
    name
    buyingPrice
    amount
    pricePerUnit
    dateOfEntry
    description
    dateOfExpry
    client {
      clientId
      username
      email
    }
  }
}
```

- UpdateShortTermProduct :

```graphql
mutation (
  $buyingPrice: Float!
  $name: String!
  $amount: Float!
  $pricePerUnit: Float!
  $description: String
  $dateOfExpry: String!
  $clientId: ID!
  $productId: ID!
) {
  UpdateShortTermProduct(
    product: {
      name: $name
      buyingPrice: $buyingPrice
      amount: $amount
      pricePerUnit: $pricePerUnit
      description: $description
      dateOfExpry: $dateOfExpry
    }
    clientId: $clientId
    productId: $productId
  ) {
    name
    description
    buyingPrice
    amount
    dateOfExpry
    pricePerUnit
    client {
      clientId
      username
      email
    }
  }
}
```

- DeleteShortTermProduct :

```graphql
mutation ($clientId: ID!, $productId: ID!, $sellingPrice: Float!) {
  DeleteShortTermProduct(
    clientId: $clientId
    productId: $productId
    sellingPrice: $sellingPrice
  ) {
    success
    message
    product
  }
}
```

- AddLongTermProduct :

```graphql
mutation (
  $name: String!
  $buyingPrice: Float!
  $amount: Float!
  $pricePerUnit: Float!
  $description: String
  $clientId: ID!
) {
  AddLongTermProduct(
    product: {
      name: $name
      buyingPrice: $buyingPrice
      amount: $amount
      pricePerUnit: $pricePerUnit
      description: $description
    }
    clientId: $clientId
  ) {
    name
    amount
    buyingPrice
    pricePerUnit
    description
    client {
      username
      clientId
      email
    }
  }
}
```

- UpdateLongTermProduct :

```graphql
mutation (
  $name: String!
  $buyingPrice: Float!
  $amount: Float!
  $pricePerUnit: Float!
  $description: String
  $clientId: ID!
  $productId: ID!
) {
  UpdateLongTermProduct(
    product: {
      name: $name
      buyingPrice: $buyingPrice
      amount: $amount
      pricePerUnit: $pricePerUnit
      description: $description
    }
    clientId: $clientId
    productId: $productId
  ) {
    name
    buyingPrice
    amount
    pricePerUnit
    description
    client {
      clientId
      username
      email
    }
  }
}
```

- DeleteLongTermProduct :

```graphql
mutation ($clientId: ID!, $productId: ID!, $sellingPrice: Float!) {
  DeleteLongTermProduct(
    clientId: $clientId
    productId: $productId
    sellingPrice: $sellingPrice
  ) {
    success
    message
    product
  }
}
```

- AddProductToRecord :

```graphql
mutation (
  $name: String!
  $sellingPrice: Float!
  $productType: String!
  $amount: Float!
  $clientId: ID!
) {
  AddProductToRecord(
    record: {
      name: $name
      sellingPrice: $sellingPrice
      productType: $productType
      amount: $amount
    }
    clientId: $clientId
  ) {
    name
    buyingPrice
    sellingPrice
    amount
    productType
    dateRecorded
    dateOfEntry
    client {
      clientId
      username
      email
    }
  }
}
```

- DeleteProductRecord :

```graphql
mutation ($recordId: ID!, $clientId: ID!) {
  DeleteProductRecord(recordId: $recordId, clientId: $clientId) {
    success
    message
    record
    productType
  }
}
```

- DeleteSelectedRecords :

```graphql
mutation ($records: [ID!]!, $clientId: ID!) {
  DeleteSelectedRecords(records: $records, clientId: $clientId) {
    success
    message
    deletedRecords
    missedRecords
  }
}
```

> When querying a `client` object type there is nested objects on it as they can be returned above and this can be applied everywhere you find this `client` object

- UpdateCredentials :> `Here it's all about updating user credentials except password`

```graphql
mutation (
  $clientId: ID!
  $username: String!
  $email: String!
  $phone: String!
  $gender: String!
  $password: String!
) {
  UpdateEmail(
    clientId: $clientId
    username: $username
    email: $email
    phone: $phone
    gender: $gender
    password: $password
  ) {
    clientId
    username
    email
    phone
    role
    active
    gender
    createdAt
    shortTermProducts {
      name
      buyingPrice
    }
    longTermProducts {
      name
      buyingPrice
    }
    shortTermProductRecords {
      name
      buyingPrice
      sellingPrice
    }
    longTermProductRecords {
      name
      buyingPrice
      sellingPrice
    }
  }
}
```

- UpdatePassword :

```graphql
mutation (
  $clientId: ID!
  $newPassword: String!
  $oldPassword: String!
  $confirmPassword: String!
) {
  UpdatePassword(
    clientId: $clientid
    oldPassword: $oldPassword
    newPassword: $newPassword
    confirmPassword: $confirmPassword
  ) {
    clientId
    username
    email
    phone
    role
    active
    gender
    createdAt
    shortTermProducts {
      name
      buyingPrice
    }
    longTermProducts {
      name
      buyingPrice
    }
    shortTermProductRecords {
      name
      buyingPrice
      sellingPrice
    }
    longTermProductRecords {
      name
      buyingPrice
      sellingPrice
    }
  }
}
```

- ResetPassword :> `By here the token being returned is valid for only two hours`

```graphql
mutation ($token: String!, $newPassword: String!, $confirmPassword: String!) {
  ResetPassword(
    token: $token
    newPassword: $newPassword
    confirmPassword: $confirmPassword
  ) {
    success
    email
    message
  }
}
```

---

> That's all about user/client queries and mutations but its not over because there is also the `admin` portion but it will come in future... once finished this documentation will be updated to include it. `Notice that this api will include the payment system which will also be controlled by admin which will be fully explained in the future.`
