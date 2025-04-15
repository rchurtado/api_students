// db.js: Configuración de la base de datos
const sqlite3 = require('sqlite3').verbose();

// Crear conexión a la base de datos
const db = new sqlite3.Database('students.sqlite', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        return;
    }
    console.log('Conexión exitosa a la base de datos SQLite.');
});

// Crear la tabla si no existe
const sqlQuery = `CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
)`;

db.run(sqlQuery, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err.message);
    } else {
        console.log('Tabla creada o ya existía.');
    }
});

module.exports = db;
