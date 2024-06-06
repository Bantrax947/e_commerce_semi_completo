/* 
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

// Seteamos el motor de plantillas
app.set('view engine', 'ejs');

// Seteamos la carpeta public para archivos estáticos
app.use(express.static('public'));

// Para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Seteamos las variables de entorno
dotenv.config({ path: './env/.env' });

// Para poder trabajar con las cookies
app.use(cookieParser());

// Llamar al router
app.use('/', require('./Routers/router'));

app.listen(3000, () => {
    console.log("Funciona el maldito servidor");
}); */


const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que la ruta sea correcta

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config({ path: './env/.env' });
// Para trabajar con las cookies
app.use(cookieParser());

// Llamar a la ruta
app.use('/', require('./Routers/router'));

app.listen(3000, () => {
    console.log("Servidor funcionando en el puerto 3000");
});
