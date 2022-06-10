const mongoose = require("mongoose")

const connectDB = (mongoURI) => {
  return mongoose.connect(mongoURI, {
    autoIndex: true,
  })
}

module.exports = connectDB
