const express = require('express');
const cors = require('cors');

// Inicialización
const app = express();
const PORT = 3000;
const TARGET_URL = 'http://www.raydelto.org/agenda.php';

app.use(cors());
app.use(express.json());

//Metodo Get
app.get('/', (req, res) => {
    res.redirect('/contactos');
});
app.get('/contactos', async (req, res) => {
    try {
        const response = await fetch(TARGET_URL);
        
        if (!response.ok) {
            throw new Error(`Error in the service: ${response.statusText}`);
        }

        const data = await response.json();
        res.json({
            mensaje: "List obtained correctly",
            cantidad: data.length,
            datos: data
        });

    } catch (error) {
        console.error('Error getting the contacts:', error);
        res.status(500).json({ error: 'There was an error trying to get all the contacts.' });
    }
});

//Metodo Post
app.post('/contactos', async (req, res) => {
    try {
        const { nombre, apellido, telefono } = req.body;
        if (!nombre || !apellido || !telefono) {
            return res.status(400).json({ error: 'Fields required (name, lastname, number).' });
        }

        const options = {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: { 'Content-Type': 'application/json' } 
        };

        const response = await fetch(TARGET_URL, options);
        const result = await response.json();

        res.status(201).json({
            mensaje: "Contacto almacenado exitosamente",
            respuesta_servidor_externo: result
        });

    } catch (error) {
        console.error('Error while saving:', error);
        res.status(500).json({ error: 'There was an error trying to save the contact.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Connected to: ${TARGET_URL}`);
});