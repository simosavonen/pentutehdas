const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  duedate: {
    type: Date,
    required: true,
  },
  dam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dog'
  },
  sire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dog'
  },
  puppies: [
    { type: Boolean }
  ],
  reservations: [
    { type: String }
  ],
  price: {
    type: Number
  },
  breeder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Litter', schema)