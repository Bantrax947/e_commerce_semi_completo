/* const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const conexion = require('../DataBase/Conexion');

// Aplica el rate limiter solo a la ruta de login
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 1* 60 * 1000, // 15 minutos
    max: 2, // Limita a 5 intentos por IP en el periodo de tiempo
    message: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 15 minutos.'
});

// Rutas públicas
router.get('/login', (req, res) => {
    res.render('Client/login', { alert: false });
});

router.get('/register', (req, res) => {
    res.render('Client/login', { alert: false });
});

// RUTAS DEL CRUD
router.get('/get', (req, res) => {
    conexion.query('SELECT * FROM usuario', (error, results) => {
        if (error) {
            console.log("NO FUNCIONÓ EL LLAMADO");
            res.status(500).send("Error en la consulta de la base de datos");
        } else {
            res.render('Admin/get', { results: results });
        }
    });
});

router.get('/put', (req, res) => {
    res.render('Admin/put');
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
const conexion = require('../DataBase/Conexion');
const rateLimit = require('express-rate-limit');

// Aplica el rate limiter solo a la ruta de login
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 3, // Limita a 2 intentos por IP en el periodo de tiempo
    handler: (req, res) => {
        res.status(429).render('Client/login', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 1 minuto.',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 100000,
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

// RUTAS DEL CRUD
router.get('/get', (req, res) => {
    conexion.query('SELECT * FROM usuario', (error, results) => {
        if (error) {
            console.log("NO FUNCIONÓ EL LLAMADO");
            res.status(500).send("Error en la consulta de la base de datos");
        } else {
            res.render('Admin/get', { results: results });
        }
    });
});

router.get('/put', (req, res) => {
    res.render('Admin/put');
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
