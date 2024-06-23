const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000; // Change the port to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from the 'public' directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Function to read the repertorio.json file
const readRepertorio = () => {
  try {
    const data = fs.readFileSync('repertorio.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading repertorio.json:', error);
    return [];
  }
};

// Function to write to the repertorio.json file
const writeRepertorio = (data) => {
  try {
    fs.writeFileSync('repertorio.json', JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to repertorio.json:', error);
  }
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
