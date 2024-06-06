const express = require('express');
const router = express.Router();

//router para las vistas
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

//router para los métodos del controller
//router.post('/register', authController.register)
//router.post('/login', authController.login)
//router.get('/logout', authController.logout)

module.exports = router;