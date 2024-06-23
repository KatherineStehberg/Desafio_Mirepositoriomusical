const express = require('express');

const PORT = 5000;

const app = express();

// RUTAS
app.get('/', (req, res) => {
  res.send('HOLA SOY GET CON NODEMON');
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
