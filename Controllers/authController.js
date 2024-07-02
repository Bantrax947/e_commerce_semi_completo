/*
  Descripción:
  Este archivo controla las funciones principales relacionadas con la autenticación de usuarios. 
  Incluye métodos para el registro, inicio de sesión y autenticación continua mediante tokens JWT.

  Funcionalidades:
  - Registro de Usuario en la BD (validación de correo existente y encriptación de contraseña)
  - Inicio de sesión (consulta a la BD para verificar credenciales y asignación de un token JWT)
  - Generación de token y configuración de cookies (para mantener la sesión activa)
  - Autenticación del usuario (verificación del token en la cookie y consulta a la BD)
  - Cierre de sesión (revocación del token al limpiar la cookie)

  Última modificación:
  01-07-2024

  Autor:
  Fabián Franco
*/        
const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../Models/Conexion');
/**
 * MÉTODO PARA REGISTRAR UN NUEVO USUARIO A LA BD
 * Este método recibe los datos del usuario desde el cuerpo de la solicitud, 
 * verifica si el correo ya está registrado, y si no lo está, guarda el nuevo usuario en la base de datos.
 *
 * @param {Object} req - Objeto de solicitud que contiene los datos del usuario (nombre, apellido, email, contraseña).
 * @param {Object} res - Objeto de respuesta para enviar la confirmación o error.
 */
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
/**
 * MÉTODO PARA INICIAR SESIÓN
 * Verifica si el correo y la contraseña proporcionados coinciden con un usuario en la base de datos,
 * y si es así, genera un token JWT y configura una cookie para mantener la sesión del usuario.
 *
 * @param {Object} req - Objeto de solicitud que contiene el email y la contraseña del usuario.
 * @param {Object} res - Objeto de respuesta para enviar la confirmación o redireccionar en caso de error.
 */
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
                httpOnly: true,  //para que solo sea accedido por protoclos HTTP Y Evite ataques XSS POR JS
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
/**
 * MÉTODO DE AUTENTICACIÓN DEL USUARIO.
 * Verifica la existencia de una cookie que contiene un token JWT. Si el token es válido y corresponde a un usuario 
 * en la base de datos, se permite el acceso; de lo contrario, se redirige al usuario a la página de inicio de sesión.
 *
 * @param {Object} req - Objeto de solicitud que contiene la cookie JWT.
 * @param {Object} res - Objeto de respuesta para redireccionar en caso de error o autenticación fallida.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
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
/**
 * MÉTODO PARA CERRAR SESIÓN Y ELIMINAR EL TOKEN
 * Este método limpia la cookie que contiene el token JWT, lo que efectivamente cierra la sesión del usuario y 
 * lo redirige a la página de inicio de sesión.
 *
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta para redirigir al usuario.
 */
exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        expires: new Date(0),
        httpOnly: true
    });
    res.redirect('/login');
};