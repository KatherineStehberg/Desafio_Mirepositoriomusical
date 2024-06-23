const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Function to read the repertorio.json file
const readRepertorio = () => {
  const data = fs.readFileSync('repertorio.json', 'utf8');
  return JSON.parse(data);
};

// Function to write to the repertorio.json file
const writeRepertorio = (data) => {
  fs.writeFileSync('repertorio.json', JSON.stringify(data, null, 2), 'utf8');
};

// POST /canciones : Add a new song to the repertoire
app.post('/canciones', (req, res) => {
  const canciones = readRepertorio();
  const newCancion = req.body;
  canciones.push(newCancion);
  writeRepertorio(canciones);
  res.status(201).json(newCancion);
});

// GET /canciones : Get all songs from the repertoire
app.get('/canciones', (req, res) => {
  const canciones = readRepertorio();
  res.json(canciones);
});

// PUT /canciones/:id : Update a song in the repertoire
app.put('/canciones/:id', (req, res) => {
  const canciones = readRepertorio();
  const id = parseInt(req.params.id, 10);
  const updatedCancion = req.body;
  const index = canciones.findIndex((cancion) => cancion.id === id);
  if (index !== -1) {
    canciones[index] = { ...canciones[index], ...updatedCancion };
    writeRepertorio(canciones);
    res.json(canciones[index]);
  } else {
    res.status(404).send('Canción no encontrada');
  }
});

// DELETE /canciones/:id : Delete a song from the repertoire
app.delete('/canciones/:id', (req, res) => {
  const canciones = readRepertorio();
  const id = parseInt(req.params.id, 10);
  const index = canciones.findIndex((cancion) => cancion.id === id);
  if (index !== -1) {
    const [deletedCancion] = canciones.splice(index, 1);
    writeRepertorio(canciones);
    res.json(deletedCancion);
  } else {
    res.status(404).send('Canción no encontrada');
  }
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
