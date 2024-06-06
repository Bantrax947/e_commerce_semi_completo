
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Router para las vistas
router.get('/', (req, res) => {
    res.render('index'); // Página principal
});

router.get('/carrito', (req, res) => {
    res.render('carrito'); // Página del carrito
});

router.get('/login', (req, res) => {
    res.render('login'); // Página de login
});

router.get('/register', (req, res) => {
    res.render('register'); // Página de registro
});

// Router para los métodos del controller
router.post('/register', authController.register);
router.post('/login', (req, res) => {
    // Lógica de inicio de sesión
    res.send('Inicio de sesión');
});

module.exports = router;