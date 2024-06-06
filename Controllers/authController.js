/* const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../DataBase/Conexion');

// Método para registrar un usuario
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, pass } = req.body;
        const passHash = await bcryptjs.hash(pass, 8);

        conexion.query('INSERT INTO usuario (Nombre, Apellido, Email, clave) VALUES (?, ?, ?, ?)', 
        [firstname, lastname, email, passHash], 
        (error, results) => {
            if (error) {
                console.log(error);
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al registrar usuario",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: "register"
                });
            } else {
                return res.render('login', {
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

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};

// Método para iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            return res.render('login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: 'Por favor ingrese un email y contraseña',
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 3000,
                ruta: 'login'
            });
        }

        conexion.query('SELECT * FROM usuario WHERE Email = ?', [email], async (error, results) => {
            if (error) {
                console.error('Error en la consulta de la base de datos:', error);
                return res.render('login', {
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
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario no encontrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

            const user = results[0];
            const passwordMatch = await bcryptjs.compare(pass, user.clave);

            if (!passwordMatch) {
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

            const id = user.idUsuario;
            const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA
            });
            const cookiesOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie('jwt', token, cookiesOptions);
            return res.render('login', {
                alert: true,
                alertTitle: "Conexión exitosa",
                alertMessage: "¡LOGIN CORRECTO!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: ''
            });
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
};

// Método de autenticación
exports.autenticacion = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM usuario WHERE idUsuario = ?', [decodificada.id], (error, results) => {
                if (!results || results.length === 0) {
                    return res.redirect('/login'); // Redirige a la página de login si no hay resultados
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return res.redirect('/login');
        }
    } else {
        return res.redirect('/login'); // Redirige a la página de login si no hay una cookie de sesión
    }
} */
const { promisify } = require('util');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../DataBase/Conexion');

// Método para registrar un usuario
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, pass } = req.body;
        const passHash = await bcryptjs.hash(pass, 8);

        conexion.query('INSERT INTO usuario (Nombre, Apellido, Email, clave) VALUES (?, ?, ?, ?)', 
        [firstname, lastname, email, passHash], 
        (error, results) => {
            if (error) {
                console.log(error);
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al registrar usuario",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: "register"
                });
            } else {
                return res.render('login', {
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

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};

// Método para iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            return res.render('login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: 'Por favor ingrese un email y contraseña',
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 3000,
                ruta: 'login'
            });
        }

        conexion.query('SELECT * FROM usuario WHERE Email = ?', [email], async (error, results) => {
            if (error) {
                console.error('Error en la consulta de la base de datos:', error);
                return res.render('login', {
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
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario no encontrado",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

            const user = results[0];
            const passwordMatch = await bcryptjs.compare(pass, user.clave);

            if (!passwordMatch) {
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña incorrecta",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

            const id = user.idUsuario;
            const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA
            });
            const cookiesOptions = {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie('jwt', token, cookiesOptions);
            return res.render('login', {
                alert: true,
                alertTitle: "Conexión exitosa",
                alertMessage: "¡LOGIN CORRECTO!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 800,
                ruta: ''
            });
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).send('Error en el servidor');
    }
};



exports.autenticacion = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // Verifica el JWT
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            // Busca al usuario en la base de datos
            conexion.query('SELECT * FROM usuario WHERE idUsuario = ?', [decodificada.id], (error, results) => {
                if (error || results.length === 0) {
                    return res.redirect('/login'); // Redirige a la página de login si hay un error o no se encuentra el usuario
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return res.redirect('/login'); // Redirige a la página de login si hay un error con el JWT
        }
    } else {
        return res.redirect('/login'); // Redirige a la página de login si no hay una cookie de sesión
    }
}


/* // Método de autenticación
exports.autenticacion = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM usuario WHERE idUsuario = ?', [decodificada.id], (error, results) => {
                if (!results || results.length === 0) {
                    return res.redirect('/login');
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return res.redirect('/login');
        }
    } else {
        return res.redirect('/login');
    }
}
 */










