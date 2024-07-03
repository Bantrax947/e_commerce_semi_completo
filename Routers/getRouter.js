// Routers/getRouter.js
const express = require('express');
const router = express.Router();
const conexion = require('../Models/Conexion');

// Ruta para obtener los productos y renderizar la vista
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
