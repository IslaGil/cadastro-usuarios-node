const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

// CREATE
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, existingUser) => {

      if (err) return res.status(500).json({ error: err.message });

      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function (err) {
          if (err) return res.status(400).json({ error: err.message });

          res.json({ id: this.lastID });
        }
      );
    }
  );
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!user) {
        return res.status(401).json({ error: 'Usuário inválido' });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      res.json({ message: 'Login realizado com sucesso' });
    }
  );
});

// READ
router.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });

    res.json(rows);
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });

    res.json({ message: 'Usuário removido com sucesso' });
  });
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
    [name, email, hashedPassword, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      res.json({ message: 'Usuário atualizado' });
    }
  );
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
    [name, email, hashedPassword, id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });

      res.json({ message: 'Usuário atualizado com sucesso' });
    }
  );
});

module.exports = router;