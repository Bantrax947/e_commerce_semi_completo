/*
  Descripción:
  Este archivo controla las funciones principales relacionadas con la autenticación de usuarios. 
  Incluye métodos para la autenticación continua mediante tokens JWT.

  Funcionalidades:
  - Generación de token y configuración de cookies (para mantener la sesión activa)
  - Autenticación del usuario (verificación del token en la cookie y consulta a la BD)
  - Cierre de sesión (revocación del token al limpiar la cookie)

  Última modificación:
  02-07-2024

  Autor:
  Fabián Franco
*/ 
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const conexion = require('../Models/Conexion');

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
