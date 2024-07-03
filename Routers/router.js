/*
  Descripción:
  Este archivo define las rutas principales de la aplicación, incluyendo rutas públicas y protegidas.
  Utiliza diferentes controladores y middlewares para manejar la autenticación, limitar la tasa de solicitudes y manejar las rutas para obtener, agregar y actualizar productos.

  Funcionalidades:
  - Rutas públicas para login y registro.
  - Aplicación de rate limiter en la ruta de login.
  - Middleware de autenticación para proteger rutas.
  - Rutas protegidas para renderizar vistas, manejar el carrito y cerrar sesión.
  - Uso de routers separados para manejar productos.
  - Ruta para obtener productos en formato JSON (API).

  Última modificación:
  02-07-2024

  Autor:
  Fabián Franco
*/

const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const loginLimiter = require('../Middlewares/rateLimit');
const authMiddleware = require('../Middlewares/auth');
const getRouter = require('./getRouter');
const postRouter = require('./postRouter');
const putRouter = require('./putRouter');
const conexion = require('../Models/Conexion');

// Rutas públicas

/**
 * Ruta para renderizar la vista de login
 * 
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para renderizar la vista de login.
 */
router.get('/login', (req, res) => {
    res.render('Client/login', { alert: false });
});

/**
 * Ruta para renderizar la vista de registro
 * 
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para renderizar la vista de registro.
 */
router.get('/register', (req, res) => {
    res.render('Client/login', { alert: false });
});

// Aplica el rate limiter en la ruta de login

/**
 * Ruta para manejar el login de usuarios
 * Aplica el rate limiter antes de llamar al controlador de login.
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
router.post('/login', loginLimiter, authController.login);

// Rutas protegidas

/**
 * Ruta para manejar el registro de usuarios
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
router.post('/register', authController.register);

// Middleware de autenticación para proteger rutas

/**
 * Middleware de autenticación para proteger rutas
 * Verifica la autenticación del usuario antes de permitir el acceso a las rutas protegidas.
 */
router.use(authMiddleware.autenticacion);

// Rutas protegidas

/**
 * Ruta para renderizar la vista principal del cliente
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para renderizar la vista principal del cliente.
 */
router.get('/', (req, res) => {
    res.render('Client/index');
});

/**
 * Ruta para renderizar la vista del carrito
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para renderizar la vista del carrito.
 */
router.get('/carrito', (req, res) => {
    res.render('Client/carrito');
});

/**
 * Ruta para manejar el cierre de sesión de usuarios
 * Limpia la cookie de sesión y redirige a la página de login.
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para redirigir al login.
 */
router.get('/logout', authMiddleware.logout);

// Usar el nuevo router para la ruta de obtener productos de getRouter.js
router.use('/get', getRouter);

// Usar el nuevo router para la ruta de cargar productos de postRouter.js
router.use('/', postRouter);

// Usar el nuevo router para la ruta de actualizar productos de putRouter.js
router.use('/', putRouter);

// Ruta para obtener los productos en formato JSON (API)

/**
 * Ruta para obtener los productos en formato JSON (API)
 * Consulta la base de datos y devuelve los productos en formato JSON.
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para enviar los productos en formato JSON.
 */
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

module.exports = router;
