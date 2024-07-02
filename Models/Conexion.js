/*
  Descripción:
La conexion con la base de datos local de la computadora
  Incluye:
-El manejo de error de conexion con la BD
  Última modificación: 
1-7-2024
  Autor:
Fabián Franco
*/
/* require('dotenv').config();
const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

conexion.connect((error) => {
    if (error) {
        console.error('Error de conexión a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

module.exports = conexion;
 */
require('dotenv').config({ path: './env/.env' });
const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

conexion.connect((error) => {
    if (error) {
        console.error('Error de conexión a la base de datos:', error);
        return;
    }
    console.log('Conexión a la base de datos exitosa');
});

module.exports = conexion;
