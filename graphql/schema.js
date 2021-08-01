const { gql } = require("apollo-server")

const typeDefs = gql`
  type ClientLoginResponse {
    "the response to the client when he or she logs in and the client is the nested query"
    token: String!
    client: Client!
  }

  type AdminLoginResponse {
    "the response to the admin when he or she logs in and the admin is a nested query"
    token: String!
    admin: Admin!
  }

  type ActivationResponse {
    success: Boolean!
    message: String!
    client: Client!
  }

  input ClientCreds {
    "The input fields required for registering the user"
    username: String!
    email: String!
    phone: String!
    password: String!
    confirmPassword: String!
    gender: String!
  }

  input AdminCreds {
    "The input fields required for registering the admin"
    name: String!
    email: String!
    phone: String!
    gender: String!
    password: String!
    confirmPassword: String!
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

  input ProductToRecordCreds {
    "the input values for the product to be recorded in the stock which means it is moved from stock"
    name: String!
    sellingPrice: Float!
    productType: String!
    amount: Float!
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

  type Client {
    "the fields for the the client or current user of the app and they include the nested queries"
    clientId: ID!
    username: String!
    email: String!
    phone: String!
    role: String!
    active: Boolean!
    gender: String!
    createdAt: String!
    shortTermProducts: [ShortTermProduct!]!
    longTermProducts: [LongTermProduct!]!
    shortTermProductRecords: [ProductRecord!]!
    longTermProductRecords: [ProductRecord!]!
  }

  type Admin {
    "the fields for the admin or the owner of the app to manage all users/clients registered in the app"
    adminId: ID!
    username: String!
    email: String!
    phone: String!
    gender: String!
    role: String!
    createdAt: String!
  }

  type ProductRecord {
    "the fields to be returned for the product record"
    client: Client!
    recordId: ID!
    name: String!
    productType: String!
    buyingPrice: Float!
    sellingPrice: Float!
    amount: Float!
    dateOfEntry: String!
    dateRecorded: String!
    description: String
  }

  type Notification {
    "The fields to be returned for the notification to the client"
    notificationId: ID!
    client: Client!
    source: String!
    message: String!
    createdAt: String!
  }

  type Payment {
    "The fields to be returned for the payment operation to the admin"
    paymentId: ID!
    client: Client!
    paid: Boolean!
    expryDate: String!
    refund: Float!
  }

  type Premium {
    "The fields to be returned for the premium cost to the admin and the client:=> the duration property represents months represented as floating number"
    premiumId: ID!
    amountPaid: Float!
    duration: Float!
    createdAt: String!
    updatedAt: String!
  }

  type NotifyResponse {
    "The fields for the response after sending request to perform any related action of notifying"
    success: Boolean!
    message: String!
    admin: Admin!
  }

  type DeleteProductResponse {
    "The response after deletion of the product will look like this"
    success: Boolean!
    message: String!
    product: ID!
  }

  type DeleteRecordResponse {
    success: Boolean!
    message: String!
    record: ID!
    productType: String!
  }

  type DeleteSelectedRecordsResponse {
    success: Boolean!
    message: String!
    deletedRecords: [ID!]!
    missedRecords: [ID!]!
  }

  type DeleteNotificationResponse {
    success: Boolean!
    message: String!
    notificationId: ID!
  }

  type ForgotPasswordResponse {
    success: Boolean!
    email: String!
    message: String!
  }

  type PremiumCostResponse {
    success: Boolean!
    message: String!
    premiumId: ID!
  }

  type DeleteAccountResponse {
    success: Boolean!
    message: String!
    accountId: ID!
  }

  type Query {
    "all query types will require Authorization tike the mutations except the LoginClient, LoginAdmin query where the client will get the authorization key and set asthe header key as Authorization and value as Bearer token and it last for 3 days"
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
    LongTermProductRecords(
      "Get all long-term products records"
      clientId: ID!
    ): [ProductRecord!]!
    ShortTermProductRecords(
      "Get all short-term product records"
      clientId: ID!
    ): [ProductRecord!]!
    Notifications(
      "Get all notifications sent to the client by the admin all types"
      clientId: ID!
    ): [Notification!]!
    PaymentStatus(
      "Get the status of payment of the user"
      clientId: ID!
    ): Payment!
    ForgotPassword(
      "Once the client forgot password he/she will send the email and send the link to the front-end which will get the data in parameters and send them to the server to update the password"
      email: String!
    ): ForgotPasswordResponse!
    LoginAdmin(
      "Login to the app as admin  with valid credentials"
      email: String!
      password: String!
    ): AdminLoginResponse!
    AllNotifications(
      "All notifications in the database and will be seen by admin"
      adminId: ID!
    ): [Notification!]!
    AllShortTermProducts(
      "All short-term products found in the database and will only be seen by admin"
      adminId: ID!
    ): [ShortTermProduct!]!
    AllLongTermProducts(
      "All long-term products found in the database and will only be seen by admin"
      adminId: ID!
    ): [LongTermProduct!]!
    AllShortTermProductRecords(
      "All short-term-product-records found in the database and will only be seen by admin"
      adminId: ID!
    ): [ProductRecord!]!
    AllLongTermProductRecords(
      "All short-term-product-records found in the database and will only be seen by admin"
      adminId: ID!
    ): [ProductRecord!]!
    AdminForgotPassword(
      "Once the admin forgot password he/she will send the email and send the link to the front-end which will get the data in parameters and send them to the server to update the password"
      email: String!
    ): ForgotPasswordResponse!
    AllPayments(
      "All payments made by the clients paying for the premium to use the app"
      adminId: ID!
    ): [Payment!]!
    AllPremiums(
      "⚠️ This query is both used by the admin and the client:=> 🚧  All premium costs to be chosen by the clients for using the app"
      adminId: ID
      clientId: ID
    ): [Premium!]!
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
    AddProductToRecord(
      "Add the product to the records which will act as deleting product from stock and the amount recorded must equal or less than the amount in the stock of the product"
      record: ProductToRecordCreds
      clientId: ID!
    ): ProductRecord!
    DeleteProductRecord(
      "Delete the record from the stock..... once the record is not needed anymore can be deleted"
      recordId: ID!
      clientId: ID!
    ): DeleteRecordResponse!
    DeleteSelectedRecords(
      "Delete the selected records while unwanted by the client he/she can select the unwanted records in certain range and delete them using this mutation"
      records: [ID!]!
      clientId: ID!
    ): DeleteSelectedRecordsResponse!
    UpdateCredentials(
      "Updating the client credentials using his/her password and the clientId"
      clientId: ID!
      username: String!
      email: String!
      phone: String!
      gender: String!
      password: String!
    ): Client!
    UpdatePassword(
      "Updating the client password using his/her old password and the clientId"
      clientId: ID!
      oldPassword: String!
      newPassword: String!
      confirmPassword: String!
    ): Client!
    ResetPassword(
      "Reseting the password by sending the token and the new password"
      token: String!
      newPassword: String!
      confirmPassword: String!
    ): ForgotPasswordResponse!
    DeleteAccount(
      "Deleting the account by the user which will completely remove him from the database"
      clientId: ID!
      confirmPassword: String!
    ): DeleteAccountResponse!
    RegisterAdmin(
      "Registering the admin of the app by sending the credentials in admin object"
      admin: AdminCreds
    ): Admin!
    NotifyAllClients(
      "Notify all clients => the message will be delivered to all clients"
      adminId: ID!
      message: String!
    ): NotifyResponse!
    NotifyPaidClients(
      "Notify to all paid clients => the message will be delivered only to paid clients"
      adminId: ID!
      message: String!
    ): NotifyResponse!
    NotifyUnPaidClients(
      "Notify to all unpaid clients => the message will be delivered only to unpaid clients"
      adminId: ID!
      message: String!
    ): NotifyResponse!
    NotifyOneClient(
      "Notify to one client => the message will be delivered only to one client"
      adminId: ID!
      clientId: ID!
      message: String!
    ): NotifyResponse!
    DeleteNotification(
      "Delete the notification once needed by the admin"
      adminId: ID!
      notificationId: ID!
    ): DeleteNotificationResponse!
    AdminResetPassword(
      "Reseting the password for the admin by sending the token and the new password"
      token: String!
      newPassword: String!
      confirmPassword: String!
    ): ForgotPasswordResponse!
    AdminUpdateCredentials(
      "Updating the admin credentials using his/her password and the clientId"
      adminId: ID!
      username: String!
      email: String!
      phone: String!
      gender: String!
      password: String!
    ): Admin!
    AdminUpdatePassword(
      "Updating the admin password using his/her old password and the clientId"
      adminId: ID!
      oldPassword: String!
      newPassword: String!
      confirmPassword: String!
    ): Admin!
    AdminSetCost(
      "To set the cost to be paid by the clients for using the app => 1 month(30 days)"
      adminId: ID!
      premiumCost: Float!
      duration: Float!
    ): PremiumCostResponse!
    AdminUpdateCost(
      "To update the previously set premium cost to be paid by the clients using the app"
      adminId: ID!
      premiumId: ID!
      newPremiumCost: Float!
      newDuration: Float
    ): PremiumCostResponse!
    AdminDeleteCost(
      "To delete the previously cost set by the admin"
      adminId: ID!
      premiumId: ID!
    ): PremiumCostResponse!
    ToggleClientActivation(adminId: ID!, clientId: ID!): ActivationResponse!
    AdminDeleteAccount(
      "⚠️ To delete this account will set the admin with:=> email: admin@stocka.com, password: admin1@graph"
      adminId: ID!
      confirmPassword: String!
    ): DeleteAccountResponse!
  }
`

module.exports = typeDefs
