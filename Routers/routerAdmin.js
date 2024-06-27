const express = require('express');
const router = express.Router();
const conexion = require('../DataBase/Conexion');

// Ruta para obtener los productos y renderizar la vista
router.get('/get', (req, res) => {
    conexion.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            console.log("Error en la consulta de la base de datos");
            res.status(500).send("Error en la consulta de la base de datos");
        } else {
            res.render('Admin/get', { results: results });
        }
    });
});

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

// Ruta para obtener un producto para editar
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

// Ruta para actualizar un producto
router.post('/update-product/:id', (req, res) => {
    const productId = req.params.id;
    const { productName, productPrice, productCategory, productImage } = req.body;
    
    const query = 'UPDATE productos SET titulo = ?, precio = ?, id_categoria = ?, imagen = ? WHERE id = ?';
    conexion.query(query, [productName, productPrice, productCategory, productImage, productId], (error, results) => {
        if (error) {
            console.error("Error al actualizar el producto:", error);
            return res.status(500).send("Error al actualizar el producto");
        }
        res.redirect('/admin/get');
    });
});

module.exports = router;
