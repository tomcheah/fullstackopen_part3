const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(result => {
    console.log('Connected to MongoDB')
    console.log(result)
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 9,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{6,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! Examples of valid phone numbers: 09-1234556 and 040-22334455`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)