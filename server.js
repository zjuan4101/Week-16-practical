require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const jsxEngine = require('jsx-view-engine')
const methodOverride = require('method-override')
const Todo = require('./models/Todo')

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'jsx')
app.engine('jsx', jsxEngine())

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once('open', () => {
    console.log('connected to mongodb')
})

// ROUTES

// Index
app.get('/todos', async (req, res) => {
    try {
        const foundTodos = await Todo.find({})
        res.render('todos/Index', {
            todos: foundTodos
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// New
app.get('/todos/new', (req, res) => {
    res.render('todos/New')
})

// Delete
app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findOneAndDelete({ '_id': req.params.id })
        .then(() => {
            res.redirect('/todos')
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// Update
app.put('/todos/:id', async (req, res) => {
    try {
        await Todo.findOneAndUpdate({ '_id': req.params.id }, req.body, { new: true })
        .then(() => {
            res.redirect(`/todos/${req.params.id}`)
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// Create
app.post('/todos', async (req, res) => {
    try {
        const createdTodo = await Todo.create(req.body)
        res.redirect(`/todos/${createdTodo._id}`)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// Edit
app.get('/todos/:id/edit', async (req, res) => {
    try {
        const foundTodo = await Todo.findOne({ '_id': req.params.id })
        res.render('todos/Edit', {
            todo: foundTodo
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

// Show
app.get('/todos/:id', async (req, res) => {
    try {
        const foundTodo = await Todo.findOne({ _id: req.params.id })
        res.render('todos/Show', {
            todo: foundTodo
        })
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
