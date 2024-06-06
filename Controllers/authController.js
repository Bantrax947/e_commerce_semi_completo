/* exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, pass } = req.body;
        const passHash = await bcryptjs.hash(pass, 8);

        conexion.query('INSERT INTO usuario (Nombre, Apellido, Email, clave) VALUES (?, ?, ?, ?)', 
        [firstname, lastname, email, passHash], 
        (error, results) => {
            if (error) {
                console.log(error);
                res.render('register', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al registrar usuario",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: "register"
                });
            } else {
                res.render('register', {
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

exports.login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        if (!email || !pass) {
            res.render('login', {
                alert: true,
                alertTitle: 'Error',
                alertMessage: 'Por favor ingrese un email y contraseña',
                alertIcon: 'error',
                showConfirmButton: true,
                timer: 3000,
                ruta: 'login'
            });
        } else {
            conexion.query('SELECT * FROM usuario WHERE Email = ?', [email], async (error, results) => {
                if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].clave))) {
                    res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                } else {
                    const id = results[0].id;
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    });
                    const cookiesOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    };
                    res.cookie('jwt', token, cookiesOptions);
                    res.render('login', {
                        alert: true,
                        alertTitle: "Conexión exitosa",
                        alertMessage: "¡LOGIN CORRECTO!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 800,
                        ruta: ''
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};
 */

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conexion = require('../DataBase/Conexion'); // Ensure this path is correct

// En la ruta de registro
exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, pass } = req.body;
        const passHash = await bcryptjs.hash(pass, 8);

        conexion.query('INSERT INTO usuario (Nombre, Apellido, Email, clave) VALUES (?, ?, ?, ?)', 
        [firstname, lastname, email, passHash], 
        (error, results) => {
            if (error) {
                console.log(error);
                return res.render('login', {  // Cambia a 'login' en lugar de 'register'
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Error al registrar usuario",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: "register"
                });
            } else {
                return res.render('login', {  // Cambia a 'login' en lugar de 'register'
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
                console.error('Database query error:', error);
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
            console.log('User found:', user);

            if (!user.clave) {  // Verifica si user.clave está definido
                return res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Contraseña no encontrada",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: 3000,
                    ruta: 'login'
                });
            }

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
            res.render('login', {
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
        console.error('Server error:', error);
        res.status(500).send('Error en el servidor');
    }
};
