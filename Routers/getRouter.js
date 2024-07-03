/*
  Descripción:
  Este archivo define las rutas para obtener y mostrar productos desde la base de datos.
  Utiliza Express para manejar las rutas y realiza consultas a la base de datos para recuperar los productos.

  Funcionalidades:
  - Obtiene todos los productos de la base de datos y renderiza una vista para mostrarlos.

  Última modificación:
  02-07-2024

  Autor:
  Fabián Franco
*/

const express = require('express');
const router = express.Router();
const conexion = require('../Models/Conexion');

/**
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para enviar los resultados de la consulta o un mensaje de error.
 */
router.get('/', (req, res) => {
    conexion.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            console.log("Error en la consulta de la base de datos");
            res.status(500).send("Error en la consulta de la base de datos");
        } else {
            res.render('Admin/get', { results: results });
        }
    });
});

module.exports = router;
