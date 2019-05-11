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
    type: String,
    unique: true,
    minlength: 5
  },
  email: {
    type: String,
    unique: true,
    minlength: 3
  },
  city: {
    type: String
  }
})

module.exports = mongoose.model('User', schema)