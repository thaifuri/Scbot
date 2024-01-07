/** 


To get started, hit RUN!

This Express.js server provides a REST API for a simple to-do list.

It supports all basic CRUD operations: list todos, get a single todo, add a new todo, update a todo, and delete a todo.

To persist the TODOs, it's using Replit DB.

 */

const express = require('express');
const bodyParser = require('body-parser');
const Database = require('@replit/database');
const db = new Database();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Todo API. Use /todos for CRUD operations.');
});

// Read all todos
app.get('/todos', async (req, res) => {
  const todos = await db.get('todos') || [];
  res.json(todos);
});

// Read a single todo
app.get('/todos/:id', async (req, res) => {
  const todos = await db.get('todos') || [];
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  todo ? res.json(todo) : res.status(404).send('Not found');
});

// Create a todo
app.post('/todos', async (req, res) => {
  let todos = await db.get('todos') || [];
  const newTodo = { id: new Date().getTime(), task: req.body.task };
  todos.push(newTodo);
  await db.set('todos', todos);
  res.status(201).json(newTodo);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  let todos = await db.get('todos') || [];
  const todo = todos.find(t => t.id === parseInt(req.params.id));

  if (todo) {
    todo.task = req.body.task;
    await db.set('todos', todos);
    res.json(todo);
  } else {
    res.status(404).send('Not found');
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  let todos = await db.get('todos') || [];
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));

  if (index > -1) {
    todos.splice(index, 1);
    await db.set('todos', todos);
    res.status(204).send();
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
