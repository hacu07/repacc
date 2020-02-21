const bcrypt = require('bcrypt')
const express = require('express')
const Usuario = require('../models/usuario')
const Estado = require('../models/estado')
const Municipio = require('../models/municipio')
const Rol = require('../models/rol')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */

 /* Obtiene datos de todos los usuarios registrados
    OJOOO FALTA MIDDLEWARE PARA VALIDAR QUIEN SOLICITA
 */
router.get('/', async (req,res)=>{
    
})


 /*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */
router.post('/registro',[
    check('correo').isEmail(),
    check('nombre').isString(),
    check('contrasena').isString(),
    check('celular').isString(),
    check('usuario').isString(),
    check('tyc').isBoolean()
],async (req, res) =>{
     // Si ocurrio un error en validación de parametros
     const errors = validationResult(req);

     if(!errors.isEmpty()){ // encontró errores
         return res.status(422).json(
             {                
                 error: true,
                 msj: "Error en datos enviados.",
                 errors: errors.array()
             }
         );
     }
    //No encontro errores en los parametros

    // Asigna estado activo y rol conductor por defecto
    let objEstado = await Estado.findOne({tipo: 1,nombre: "ACTIVO"})
    let objRol = await Rol.findOne({tipo:3})
    let objUsuVal = await Usuario.findOne({$or:[{usuario: req.body.usuario},{qr: req.body.usuario}]})

    // Si encontro
    if(objEstado && objRol && req.body.tyc){
        if(objUsuVal){
            return res.json({
                error: true,
                msj: "Usuario no disponible."
            })
        }else{
            // Usuario disponible

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(req.body.contrasena, salt)

            const usuSave = new Usuario({
                qr: req.body.usuario,
                correo: req.body.correo,
                nombre: req.body.nombre,
                contrasena: hashPassword,
                celular: req.body.celular,
                usuario: req.body.usuario,
                tyc: req.body.tyc,
                rol: objRol._id,
                estado: objEstado._id
            })

            try {
                // guarda en BD
                const usuSaved = await usuSave.save()

                // genera JWT
                // const jwtToken = usuSaved.generateJWT()

                res.status(201)
                    //.header('Authorization', jwtToken)
                    .send({
                        error: false,
                        content: usuSaved
                    })

            } catch (e) {
                return res.json({
                    error: true,
                    msj: "Error al registrar usuario.",
                    errors: e
                })
            }
        }
    }else{
        // no encontro estado y rol a asignar por defecto
        res.json({
            error: true,
            msj: "No se logró registrar el usuario."
        })
    }
})


 module.exports = router