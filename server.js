const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

app.use(express.static('public'));