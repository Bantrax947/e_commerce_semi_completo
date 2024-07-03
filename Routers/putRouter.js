/*
  Descripción:
  Este archivo define las rutas para obtener y actualizar productos en la base de datos.
  Utiliza Express para manejar las rutas y realiza consultas a la base de datos para obtener y actualizar productos.

  Funcionalidades:
  - Obtener los datos de un producto específico para edición.
  - Renderizar la vista de edición.
  - Actualizar un producto específico en la base de datos.

  Última modificación:
  02-07-2024

  Autor:
  Fabián Franco
*/

const express = require('express');
const router = express.Router();
const conexion = require('../Models/Conexion');

/**
 * Ruta para obtener productos para edición
 * Recibe el ID del producto como parámetro de la ruta, consulta la base de datos y 
 * renderiza la vista de edición con los datos del producto.
 *
 * @param {Object} req - Objeto de solicitud que contiene el ID del producto en los parámetros de la ruta.
 * @param {Object} res - Objeto de respuesta para renderizar la vista de edición con los datos del producto.
 */
router.get('/put/:id', (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM productos WHERE id = ?';
    
    conexion.query(query, [productId], (error, results) => {
        if (error) {
            console.error("Error al obtener el producto:", error);
            return res.status(500).send("Error al obtener el producto");
        }
        if (results.length === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        res.render('Admin/put', { product: results[0] });
    });
});

/**
 * Ruta para renderizar la vista de edición sin un producto específico
 * Renderiza la vista de edición sin datos de un producto específico.
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para renderizar la vista de edición.
 */
router.get('/put', (req, res) => {
    res.render('Admin/put');
});

/**
 * Ruta para actualizar productos
 * Recibe el ID del producto como parámetro de la ruta y los datos del producto en el cuerpo de la solicitud,
 * actualiza los datos del producto en la base de datos y redirige a la vista de productos.
 *
 * @param {Object} req - Objeto de solicitud que contiene el ID del producto en los parámetros de la ruta 
 * y los datos del producto en el cuerpo.
 * @param {Object} res - Objeto de respuesta para redirigir a la vista de productos.
 */
router.post('/update-product/:id', (req, res) => {
    const productId = req.params.id;
    const { productName, productPrice, productCategory, productImage } = req.body;
    
    const query = 'UPDATE productos SET titulo = ?, precio = ?, id_categoria = ?, imagen = ? WHERE id = ?';
    conexion.query(query, [productName, productPrice, productCategory, productImage, productId], (error, results) => {
        if (error) {
            console.error("Error al actualizar el producto:", error);
            return res.status(500).send("Error al actualizar el producto");
        }
        res.redirect('/get');
    });
});

module.exports = router;
