const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../DataBase/Conexion');

/* METODO PARA REGISTRAR USUARIO */
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, pass } = req.body;
        const passHash = await bcryptjs.hash(pass, 8);

        // Verificar si el correo electrónico ya está registrado
        conexion.query('SELECT * FROM usuario WHERE Email = ?', [email], (error, results) => {
            if (error) {
                console.log(error);
                return res.render('Client/login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error en la consulta de la base de datos",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 6000,
                    ruta: "register"
                });
            }

            if (results.length > 0) {
                return res.render('Client/login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "El correo electrónico ya está registrado",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 6000,
                    ruta: "register"
                });
            }

            // Si el correo no está registrado, insertar el nuevo usuario
            conexion.query('INSERT INTO usuario (Nombre, Apellido, Email, clave) VALUES (?, ?, ?, ?)', 
            [firstname, lastname, email, passHash], 
            (error, results) => {
                if (error) {
                    console.log(error);
                    return res.render('Client/login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Error al registrar usuario",
                        alertIcon: "error",
                        showConfirmButton: true,
                        timer: 6000,
                        ruta: "register"
                    });
                } else {
                    return res.render('Client/login', {
                        alert: true,
                        alertTitle: "Éxito",
                        alertMessage: "Usuario registrado correctamente",
                        alertIcon: "success",
                        showConfirmButton: true,
                        timer: 3000,
                        ruta: "login"
                    });
                }
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};


/* METODO PARA INICIAR SESION */
exports.login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            return res.render('Client/login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: 'Por favor ingrese un email y contraseña',
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 3000,
                ruta: 'login'
            });
        }

        // SE CONSULTA A LA BASE DE DATOS SI EXISTE ESTA PERSONA
        conexion.query('SELECT * FROM usuario WHERE Email = ?', [email], async (error, results) => {
            if (error) {
                console.error('Error en la consulta de la base de datos:', error);
                return res.render('Client/login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al buscar usuario",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

            if (results.length === 0) {
                console.log("Usuario no encontrado con ese email");
                return res.render('Client/login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario no encontrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

            const usuario = results[0];
            const passwordMatch = await bcryptjs.compare(pass, usuario.clave);

            if (!passwordMatch) {
                console.log("Contraseña incorrecta");
                return res.render('Client/login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

            const id = usuario.idUsuario;
            const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA
            });
            console.log("Token generado:", token);

            const cookiesOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' // Solo para producción y solo lectura
            };
            res.cookie('jwt', token, cookiesOptions);
            console.log("Cookie 'jwt' configurada con las opciones:", cookiesOptions);

            // Redireccionar al dashboard o página de inicio después de login exitoso
            return res.redirect('/');
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
};
/* METODO DE AUTENTICACIÓN DEL USUARIO */
exports.autenticacion = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            console.log("Token JWT decodificado:", decodificada);

            conexion.query('SELECT * FROM usuario WHERE idUsuario = ?', [decodificada.id], (error, results) => {
                if (error || results.length === 0) {
                    console.error("Error en la consulta o usuario no encontrado");
                    return res.redirect('/login');
                }
                req.user = results[0];
                console.log("Usuario autenticado:", req.user);
                return next();
            });
        } catch (error) {
            console.error("Error al verificar el JWT:", error);
            return res.redirect('/login');
        }
    } else {
        console.error("No se encontró la cookie de sesión");
        return res.redirect('/login');
    }
};

/* CIERRE DE SESION Y ELIMINACION DE TOKEN */
exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true
    });
    res.redirect('/login');
};












