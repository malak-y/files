const request = require('supertest');
const app = require('./app');

describe('Todo API', () => {

  // ── GET /health ──────────────────────────────────────────────────────────────
  describe('GET /health', () => {
    it('returns status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // ── GET /todos ───────────────────────────────────────────────────────────────
  describe('GET /todos', () => {
    it('returns an array of todos', async () => {
      const res = await request(app).get('/todos');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.todos)).toBe(true);
    });

    it('filters by completed=true', async () => {
      const res = await request(app).get('/todos?completed=true');
      expect(res.statusCode).toBe(200);
      res.body.todos.forEach(t => expect(t.completed).toBe(true));
    });

    it('filters by completed=false', async () => {
      const res = await request(app).get('/todos?completed=false');
      expect(res.statusCode).toBe(200);
      res.body.todos.forEach(t => expect(t.completed).toBe(false));
    });
  });

  // ── POST /todos ──────────────────────────────────────────────────────────────
  describe('POST /todos', () => {
    it('creates a new todo', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Test todo' });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.todo.title).toBe('Test todo');
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.id).toBeDefined();
    });

    it('returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/todos')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when title is empty string', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: '   ' });

      expect(res.statusCode).toBe(400);
    });
  });

  // ── PATCH /todos/:id ─────────────────────────────────────────────────────────
  describe('PATCH /todos/:id', () => {
    let todoId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Patch me' });
      todoId = res.body.todo.id;
    });

    it('updates completed status', async () => {
      const res = await request(app)
        .patch(`/todos/${todoId}`)
        .send({ completed: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.todo.completed).toBe(true);
    });

    it('updates title', async () => {
      const res = await request(app)
        .patch(`/todos/${todoId}`)
        .send({ title: 'Updated title' });

      expect(res.statusCode).toBe(200);
      expect(res.body.todo.title).toBe('Updated title');
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app)
        .patch('/todos/nonexistent-id')
        .send({ completed: true });

      expect(res.statusCode).toBe(404);
    });
  });

  // ── DELETE /todos/:id ────────────────────────────────────────────────────────
  describe('DELETE /todos/:id', () => {
    let todoId;

    beforeEach(async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Delete me' });
      todoId = res.body.todo.id;
    });

    it('deletes a todo by id', async () => {
      const res = await request(app).delete(`/todos/${todoId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Confirm it's gone
      const check = await request(app).get(`/todos/${todoId}`);
      expect(check.statusCode).toBe(404);
    });

    it('returns 404 for unknown id', async () => {
      const res = await request(app).delete('/todos/nonexistent-id');
      expect(res.statusCode).toBe(404);
    });
  });

});
