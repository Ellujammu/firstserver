const cors = require('cors')
const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('person', function (req) { return JSON.stringify({"name": req.body.name, "number": req.body.number})})

app.use(morgan('tiny'))
app.use(
    morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.person(req,res)
  ].join(' ')
}))


let persons = [
        {
        "name": "toimiiko",
        "number": "ei",
        "id": 1
      }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p> ${Date(Date.now())}</p>
        </div>`
        )
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(x => x.id === id)
        if (person) {
            response.json(person)
        } else {   
            response.status(404).end()
        }
  })

  app.post('/api/persons/', (request, response) => {
    const person = request.body
    console.log(person)
        if (!person.name || !person.number) {
            if(person.name === undefined) {
                return response.status(404).json({error: 'name missing'})
            } else {
                return response.status(404).json({error: 'number missing'})
            }
        } else if (persons.find(x => x.name === person.name) !== undefined) {
            return response.status(404).json({error: 'name already added'})
        } else {
            const ihminen = {
                id: Math.round(Math.random()*10**12),
                name: person.name,
                number: person.number,
            }
            persons = persons.concat(ihminen)
            return(response.json(ihminen))
        }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(x => x.id !== id)
    persons = person 
        if (person) {
            response.status(204).end()
        } else {   
            response.status(404).end()
        }
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})