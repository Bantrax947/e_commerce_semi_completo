// Routers/router.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const loginLimiter = require('../Middlewares/rateLimit');
const authMiddleware = require('../Middlewares/auth');
const getRouter = require('./getRouter'); // Importar el nuevo router
const postRouter = require('./postRouter'); // Importar el nuevo router
const conexion = require('../Models/Conexion'); // Importar correctamente

// Rutas públicas
router.get('/login', (req, res) => {
    res.render('Client/login', { alert: false });
});

router.get('/register', (req, res) => {
    res.render('Client/login', { alert: false });
});

// Aplica el rate limiter en la ruta de login
router.post('/login', loginLimiter, authController.login);

// Rutas protegidas
router.post('/register', authController.register);

// Middleware de autenticación para proteger rutas
router.use(authMiddleware.autenticacion);

// Rutas protegidas
router.get('/', (req, res) => {
    res.render('Client/index');
});

router.get('/carrito', (req, res) => {
    res.render('Client/carrito');
});

router.get('/logout', authMiddleware.logout);

// Usar el nuevo router para la ruta de obtener productos de getRouter.js
router.use('/get', getRouter);
// Usar el nuevo router para la ruta de cargar productos de postRouter.js
router.use('/',postRouter);

// Ruta para obtener los productos en formato JSON (API)
router.get('/api/productos', (req, res) => {
    conexion.query('SELECT * FROM productos', (error, results) => {
        if (error) {
            console.log("Error en la consulta de la base de datos");
            res.status(500).send("Error en la consulta de la base de datos");
        } else {
            res.json(results);
        }
    });
});

// Ruta para poder obtener los productos correctamente para poder editar
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

router.get('/put', (req, res) => {
    res.render('Admin/put');
});

router.get('/put/:id', (req, res) => {
    const productId = req.params.id;
    res.render('Admin/put', { productId: productId });
});

// Ruta para editar los productos seleccionados en el get con su ID
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
