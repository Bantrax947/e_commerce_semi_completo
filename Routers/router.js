/* 

const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const conexion = require('../DataBase/Conexion');
const rateLimit = require('express-rate-limit');

// Aplica el rate limiter solo a la ruta de login
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 3, // Limita a 3 intentos por IP en el periodo de tiempo
    handler: (req, res) => {
        res.status(429).render('Client/login', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 1 minuto.',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 3000,
            ruta: 'login'
        });
    }
});

// Rutas públicas
router.get('/login', (req, res) => {
    res.render('Client/login', { alert: false });
});

router.get('/register', (req, res) => {
    res.render('Client/login', { alert: false });
});



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
///////////////////////////////////////////////////////////////////////////////////////////

//Ruta para poder obtener los productos correctametne para podes poder editar
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

///////////////////////////////////////////////////////////////////////////////////////////

//Ruta para poder editar los productos que hayan sido seleccionados en el get con su ID
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

//////////////////////////////////////////////////////////////////////////////////////

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

router.get('/put', (req, res) => {
    res.render('Admin/put');
});

router.get('/put/:id', (req, res) => {
    const productId = req.params.id;
    // Aquí puedes realizar consultas adicionales para obtener los detalles del producto con el productId
    res.render('Admin/put', { productId: productId });
});

// Aplica el rate limiter en la ruta de login
router.post('/login', loginLimiter, authController.login);

// Rutas protegidas
router.post('/register', authController.register);

// Middleware de autenticación para proteger rutas
router.use(authController.autenticacion);

// Rutas protegidas
router.get('/', (req, res) => {
    res.render('Client/index');
});

router.get('/carrito', (req, res) => {
    res.render('Client/carrito');
});

router.get('/logout', authController.logout);

module.exports = router;
 */

const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const rateLimit = require('express-rate-limit');

// Aplica el rate limiter solo a la ruta de login
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 3, // Limita a 3 intentos por IP en el periodo de tiempo
    handler: (req, res) => {
        res.status(429).render('Client/login', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 1 minuto.',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 3000,
            ruta: 'login'
        });
    }
});

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
router.use(authController.autenticacion);

// Rutas protegidas
router.get('/', (req, res) => {
    res.render('Client/index');
});

router.get('/carrito', (req, res) => {
    res.render('Client/carrito');
});

router.get('/logout', authController.logout);

module.exports = router;
