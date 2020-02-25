const bcrypt = require('bcrypt')
const express = require('express')
const Usuario = require('../models/usuario')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
// Validador de parametros enviados Ej: valida si es un correo, min cantidad de caracteres, etc.
const { check, validationResult } = require('express-validator');

// LOGIN
router.post('/login', [   
    // validacion de datos con "express-validator"
    check('usuario').isString(),                // Si es un correo
    check('contrasena').isString()
], async (req, res)=>{

    // Valida si ocurrio alun error en la validacion de parametros
    const errors = validationResult(req);
    if(!errors.isEmpty()){ // encontro errores
        return res.status(422).json(
                { errors: errors.array()}
            );
    }

    // Json de respuesta en caso de error
    const msjError = {
        error: true,
        msj: "Usuario o contraseña incorrectos."
    }

    //  busca por usuario
    let user = await Usuario.findOne({usuario: req.body.usuario})
    //  No existe usuario
    if(!user) return res.status(400).send(msjError)

    // valida la contraseña: retorna true si es igual
    const validPassword = await bcrypt.compare(req.body.contrasena, user.contrasena)
    // no es igual
    if(!validPassword) return res.status(400).send(msjError)

    // Genera JWT
    const jwtToken = user.generateJWT()

    user.contrasena = null

    res.status(201)
    .header('Authorization',jwtToken)   // envia token en el header en modo clave: valor
    .json({                             // retorna respuesta con parametros en body
        error: false,
        content: user
    })
})

module.exports = router