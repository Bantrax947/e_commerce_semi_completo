/* const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Ruta para la página principal
router.get('/', (req, res) => {
    res.render('index');
});

// Ruta para la página del carrito
router.get('/carrito', (req, res) => {
    res.render('carrito');
});

// Ruta para la página de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Ruta para el registro de usuarios
router.post('/register', authController.register);

// Ruta para el inicio de sesión
router.post('/login', authController.login);

module.exports = router; */

const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Ruta para la página principal
router.get('/', (req, res) => {
    res.render('index');
});

// Ruta para la página del carrito
router.get('/carrito', (req, res) => {
    res.render('carrito');
});

// Ruta para la página de login
router.get('/login', (req, res) => {
    res.render('login', { alert: false });
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
    res.render('register', { alert: false });
});

// Ruta para el registro de usuarios
router.post('/register', authController.register);

// Ruta para el inicio de sesión
router.post('/login', authController.login);

module.exports = router;
