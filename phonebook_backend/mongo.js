const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@fullstackopen.11exm.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[3]
const number = process.argv[4]

if (name === undefined || number === undefined) {
  console.log('phonebook:')
  mongoose
    .connect(url)
    .then((result) => {
      console.log('connected')
      console.log(result)
      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
    })
    .catch((err) => console.log(err))
} else {
  mongoose
    .connect(url)
    .then((result) => {
      console.log(result)
      console.log('connected')

      const person = new Person({
        name: name,
        number: number,
      })

      return person.save()
    })
    .then(() => {
      console.log('contact saved!')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}
