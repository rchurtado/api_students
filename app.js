const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 8001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer();

// Ruta para obtener todos los estudiantes
app.get('/students', (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Ruta para agregar un nuevo estudiante
app.post('/students', upload.none(),  (req, res) => {
    console.log('Datos recibidos en req.body:', req.body);
    const { firstname, lastname, gender, age } = req.body;

    if (!firstname || !lastname || !gender) {
        return res.status(400).send('Error: Los campos firstname, lastname y gender son obligatorios.');
    }
    const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
    const params = [firstname, lastname, gender, age];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).send(`Estudiante creado con ID: ${this.lastID}`);
        }
    });
});

// Ruta para obtener un estudiante por ID
app.get('/student/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (!row) {
            res.status(404).send('Estudiante no encontrado');
        } else {
            res.json(row);
        }
    });
});

// Ruta para actualizar un estudiante
app.put('/student/:id', (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, gender, age } = req.body;
    const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
    const params = [firstname, lastname, gender, age, id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(`Estudiante con ID: ${id} actualizado`);
        }
    });
});

// Ruta para eliminar un estudiante
app.delete('/student/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM students WHERE id = ?';

    db.run(sql, id, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.send(`Estudiante con ID: ${id} eliminado`);
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});