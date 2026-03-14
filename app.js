const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── In-Memory Store ───────────────────────────────────────────────────────────
let todos = [
  { id: uuidv4(), title: 'Set up Jenkins pipeline', completed: false, createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Write Dockerfile',         completed: true,  createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Configure Kubernetes',     completed: false, createdAt: new Date().toISOString() },
];

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// GET /todos  →  list all todos (optional ?completed=true/false filter)
app.get('/todos', (req, res) => {
  const { completed } = req.query;

  let result = todos;
  if (completed !== undefined) {
    result = todos.filter(t => t.completed === (completed === 'true'));
  }

  res.json({ success: true, count: result.length, todos: result });
});

// GET /todos/:id  →  get a single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });
  res.json({ success: true, todo });
});

// POST /todos  →  create a new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const newTodo = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  res.status(201).json({ success: true, todo: newTodo });
});

// PATCH /todos/:id  →  update (toggle complete or rename)
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });

  const { title, completed } = req.body;
  if (title !== undefined)     todo.title     = title.trim();
  if (completed !== undefined) todo.completed = completed;

  res.json({ success: true, todo });
});

// DELETE /todos/:id  →  remove a todo
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Todo not found' });

  const deleted = todos.splice(index, 1)[0];
  res.json({ success: true, deleted });
});

// DELETE /todos  →  clear all completed
app.delete('/todos', (req, res) => {
  const before = todos.length;
  todos = todos.filter(t => !t.completed);
  res.json({ success: true, removed: before - todos.length });
});

// Serve frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅  Todo API running on http://localhost:${PORT}`);
  });
}

module.exports = app; // export for tests
