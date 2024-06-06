const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../DataBase/Conexion');
const { promisify } = require('util');

// Procedimiento para registrarnos
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, pass } = req.body;

        // No imprimas la contraseña real
        console.log(`${firstname} -- ${lastname} -- ${email}`);

        // Genera el hash de la contraseña
        const passHash = await bcryptjs.hash(pass, 8);
        console.log(passHash);

        // Inserta los datos en la tabla Usuarios
        conexion.query('INSERT INTO usuario (Nombre, Apellido, Email, clave) VALUES (?, ?, ?, ?)', 
        [firstname, lastname, email, passHash], 
        (error, results) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error al registrar usuario');
            } else {
                res.redirect('/');
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};