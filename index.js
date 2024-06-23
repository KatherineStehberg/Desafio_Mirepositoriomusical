const express= require ('express');
const PORT = 5000;
const app = express();
const fs = require('fs');
app.use(express.json());

//Devolver una página web como respuesta a una consulta GET
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
    })

    //Ofrecer diferentes rutas con diferentes métodos HTTP que permitan las operaciones
    //CRUD de datos alojados en un archivo JSON local 

//POST /canciones 
app.post('/canciones', (req, res) => {
    try{
        const cancion = req.body
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
        cancion.id = canciones.length ? canciones[canciones.length - 1].id + 1 : 1;
        canciones.push(cancion)
        fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2))
        res.send("Canción agregada con éxito!")
    } catch (err){
        res.status(500).json({message: 'Error en la solicitud'})
    }
})

//GET /canciones
app.get('/canciones', (req, res) => {
    try {
        const canciones = JSON.parse (fs.readFileSync('repertorio.json', 'utf8'));
        res.status(200).json(canciones)
        console.log(canciones)
    } catch(err){
        res.status(500).json({message: 'Error en la solicitud'})
    }
})

//PUT /canciones/:id
app.put('/canciones/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cancionModificada = req.body;
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
        const index = canciones.findIndex(cancion => cancion.id == id);
        if (index !== -1) {
            canciones[index] = { ...canciones[index], ...cancionModificada };
            fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
            res.send("Canción modificada con éxito");
        } else {
            res.status(404).json({ message: 'Canción no encontrada' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error en la solicitud' });
    }
});

//DELETE /canciones/:id
app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8"))
    const index = canciones.findIndex(p => p.id == id)
    canciones.splice(index, 1)
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2))
    res.send("Canción eliminada con éxito")
    })

app.listen(PORT, console.log(`http://localhost:${PORT}`));

