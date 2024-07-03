/*
  Descripción:
  Este archivo configura y arranca el servidor Express para la aplicación de comercio electrónico.
  Configura las vistas, middlewares, y rutas necesarias para el funcionamiento del servidor.

  Funcionalidades:
  - Configuración del motor de vistas EJS.
  - Middlewares para el manejo de archivos estáticos, parseo de cuerpos de solicitud, cookies, y logging.
  - Configuración del middleware para rate limiting en la ruta de login.
  - Eliminación de la caché para usuarios no autenticados.
  - Importación y uso de rutas definidas en `router.js`.
  - Configuración y escucha en el puerto especificado en el archivo de entorno.

  Última modificación:
  02-07-2024

  Autor:
  Fabián Franco
*/

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

// Importar el middleware de rate limiting
const loginLimiter = require('./Middlewares/rateLimit');

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares

/**
 * Servir archivos estáticos desde la carpeta 'public'.
 */
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

/**
 * Parsear cuerpos de solicitudes en formato JSON.
 */
app.use(express.json());

/**
 * Configuración de variables de entorno desde el archivo .env.
 */
dotenv.config({ path: './env/.env' });

/**
 * Middleware para parsear cookies.
 */
app.use(cookieParser());

/**
 * Middleware de logging para registrar las solicitudes HTTP.
 */
app.use(morgan("dev"));

// Para eliminar la cache 
/**
 * Middleware para eliminar la caché en respuestas para usuarios no autenticados.
 */
app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    next();
});

// Llamar a la ruta
/**
 * Middleware para usar las rutas definidas en 'router.js'.
 */
app.use('/', require('./Routers/router'));

// Conexión con el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});



