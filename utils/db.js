const mongoose = require("mongoose")
const { MONGO_URL } = require("./keys")

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    console.log(`🗄️  Connected to DB`)
  } catch (e) {
    console.error(`🚫  Error has occured: ${e}`)
  }
}

module.exports = connectDB
