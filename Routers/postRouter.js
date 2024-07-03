const express = require('express');
const router = express.Router();
const conexion = require('../Models/Conexion');
// Ruta para agregar productos a la base de datos
router.post('/add-product', (req, res) => {
    const { productName, productPrice, productCategory, productImage } = req.body;

    if (!productName || !productPrice || !productCategory || !productImage) {
        return res.status(400).send("Todos los campos son requeridos");
    }

    const query = 'INSERT INTO productos (titulo, imagen, precio, id_categoria) VALUES (?, ?, ?, ?)';
    conexion.query(query, [productName, productImage, productPrice, productCategory], (error, results) => {
        if (error) {
            console.error("Error al insertar el producto:", error);
            return res.status(500).send("Error en la consulta de la base de datos");
        }

        // Obtener el producto recién insertado
        const newProduct = {
            id: results.insertId,
            titulo: productName,
            imagen: productImage,
            precio: productPrice,
            id_categoria: productCategory
        };

        res.status(200).json(newProduct); // Enviar el nuevo producto en la respuesta
    });
});

module.exports = router;