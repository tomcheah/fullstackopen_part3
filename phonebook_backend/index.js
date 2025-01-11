require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// error handlers

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(`error name: ${error.name}`)
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> ${date}`)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => {
    next(error)
  })

})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findOneAndDelete({ _id: request.params.id }).then(() => {
    console.log(`deleted person with id ${request.params.id}`)
    response.status(204).end()
  }).catch(error => {
    next(error)
  })
})

app.post('/api/persons', (request, response, next) => {
  const newPerson = request.body

  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const newPerson = request.body
  const id = request.params.id
  const person = {
    name: newPerson.name,
    number: newPerson.number
  }
  Person.findByIdAndUpdate(id, person, { new : true , runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})