const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'breeder', 'admin']
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  city: {
    type: String
  }
})

module.exports = mongoose.model('User', schema)