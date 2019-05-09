const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  born: {
    type: Date
  },
  isFemale: {
    type: Boolean,
    required: true
  },
  breed: {
    type: String
  }
})

module.exports = mongoose.model('Dog', schema)