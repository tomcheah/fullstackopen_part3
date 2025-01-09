const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { v4: uuidv4 } = require('uuid')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Becky Arty',
    number: '245-123456'
  },
]

app.get('/api/persons', (request,response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p> ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }
  if (!person.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }
  if (persons.find(p => p.name === person.name)) {
    return response.status(400).json({
      error: `entry with name ${person.name} already exists`
    })
  }

  person.id = uuidv4()
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})