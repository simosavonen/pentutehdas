if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const Litter = require('../models/litter')
const User = require('../models/user')
const Dog = require('../models/dog')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).catch(error => {
  console.log(
    'Mock-litters script failed to connect to MongoDB:',
    error.message
  )
})

const { english: breeds } = require('./Breeds.json')
const { finnish: names } = require('./dogNames.json')

const randomBreed = breeds[Math.floor(Math.random() * breeds.length)]

const today = new Date()
const monthFromToday = new Date().setMonth(today.getMonth() + 1)
const yearAgo = new Date().setFullYear(today.getFullYear() - 1)
const twoYearsAgo = new Date().setFullYear(today.getFullYear() - 2)

const randomPuppies = () => {
  const puppies = []
  for (let i = 0; i < Math.random() * 6 + 3; i++) {
    puppies.push(Math.random() < 0.5)
  }
  return puppies
}

const mockLitters = async () => {
  try {
    const breeder = await User.findOne({ username: 'breeder' })

    // Weekly: add two dogs of random breed
    // and create a litter with estimated due date in a month
    if (today.getDay() === 0) {
      const dam = new Dog({
        name: names[Math.floor(Math.random() * names.length)],
        born: yearAgo,
        isFemale: true,
        breed: randomBreed,
        owner: breeder._id,
      })
      await dam.save()

      const sire = new Dog({
        name: names[Math.floor(Math.random() * names.length)],
        born: twoYearsAgo,
        isFemale: false,
        breed: randomBreed,
        owner: breeder._id,
      })
      await sire.save()

      const litter = new Litter({
        duedate: monthFromToday,
        dam: dam,
        sire: sire,
        puppies: [],
        reservations: [],
        price: Math.ceil((Math.random() * 1000 + 200) / 10) * 10,
        breeder: breeder._id,
      })
      await litter.save()
    }

    // Daily: Check if a litter was due to give birth today, and add puppies
    const puppyless = await Litter.findOne({
      breeder: breeder,
      duedate: today.toISOString().substring(0, 10),
      puppies: [],
    })

    if (puppyless) {
      await Litter.findByIdAndUpdate(puppyless._id, {
        puppies: randomPuppies(),
      })
    }

    // Daily: randomly sell 1 puppy from each of your litters
    const littersWithPuppies = await Litter.find({
      breeder: breeder,
      duedate: { $lt: today.toISOString().substring(0, 10) },
      puppies: { $ne: [] },
    })

    for (let i = 0; i < littersWithPuppies.length; i++) {
      if (Math.random() < 0.4) {
        await Litter.findByIdAndUpdate(littersWithPuppies[i]._id, {
          puppies: littersWithPuppies[i].puppies.slice(1),
        })
      }
    }
  } catch (error) {
    console.log('mock-litters script ran into problems', error)
  } finally {
    mongoose.connection.close()
  }
}

mockLitters()
