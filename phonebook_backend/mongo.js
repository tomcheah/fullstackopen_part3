require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  mongoose.connect(url)
  console.log('getting all contacts from database')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  mongoose.connect(url)
  console.log('adding new contact to database')
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(() => {
    console.log(`added new contact ${name} to database`)
    mongoose.connection.close()
  })

} else {
  console.log('Please provide the correct number of arguments')
  process.exit(1)
}
