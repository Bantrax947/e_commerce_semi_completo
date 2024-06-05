const express = require('express')
const router = express.Router()

//const authController = require('../controllers/authController')

//router para las vistas
//router.get('/', authController.isAuthenticated, (req, res)=>{ 
    

router.get('/',(req,res)=>{
    res.render('index')
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.get('/resgister',(req,res)=>{
    res.render('resgister')
})



//router para los métodos del controller
//router.post('/register', authController.register)
//router.post('/login', authController.login)
//router.get('/logout', authController.logout)

module.exports = router