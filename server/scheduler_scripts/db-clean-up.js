if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const Litter = require('../models/litter')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).catch(error => {
  console.log('Clean-up script failed to connect to MongoDB:', error.message)
})

const today = new Date()
const sixMonthsAgo = today.setMonth(today.getMonth() - 6)
Litter.deleteMany({ duedate: { $lte: +sixMonthsAgo } }).then(result => {
  console.log('Clean-up script removed', result.deletedCount, 'litter(s)')
  mongoose.connection.close()
})
