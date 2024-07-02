/*
  Descripción:
  Este archivo controla las funciones principales relacionadas con el limite de intenteos para el inicio
  de sesion erronea

  Funcionalidades:
  - implementa un limite de in

  Última modificación:
  02-07-2024

  Autor:
  Fabián Franco
*/ 
const rateLimit = require('express-rate-limit');

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

module.exports = loginLimiter;
