/* 


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de inicio de sesión (pública)
router.get('/login', (req, res) => {
    res.render('login', { alert: false });
});

// Ruta de registro (pública)
router.get('/register', (req, res) => {
    res.render('register', { alert: false });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

// Middleware de autenticación para proteger rutas
router.use(authController.autenticacion);

// Rutas protegidas
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/carrito', (req, res) => {
    res.render('carrito');
});

module.exports = router;
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas públicas
router.get('/login', (req, res) => {
    res.render('login', { alert: false });
});

router.get('/register', (req, res) => {
    res.render('register', { alert: false });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

// Middleware de autenticación para proteger rutas
router.use(authController.autenticacion);

// Rutas protegidas
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/carrito', (req, res) => {
    res.render('carrito');
});

module.exports = router;
