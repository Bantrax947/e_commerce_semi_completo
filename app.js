const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();


// Define el límite de rate limiting
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutos
    max: 2, // Limita a 5 intentos por IP en el periodo de tiempo
    handler: (req, res) => {
        res.status(429).render('Client/login', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intente de nuevo después de 15 minutos.',
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 3000,
            ruta: 'login'
        });
    }
});
// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config({ path: './env/.env' });
app.use(cookieParser());
app.use(morgan("dev"));

// Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    next();
});

// Llamar a la ruta
app.use('/', require('./Routers/router'));

//Conexión con el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});


