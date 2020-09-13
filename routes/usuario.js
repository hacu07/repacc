const bcrypt = require('bcrypt')
const express = require('express')
const Usuario = require('../models/usuario')
const Estado = require('../models/estado')
const Rol = require('../models/rol')
const Util = require('../controllers/Util')
const UsuarioCtrl = require("../controllers/UsuarioCtrl")
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */

 /* Busca segun "usuario" enviado
 */
router.get('/buscar/:usuario',[
    check('usuario').trim().isString().notEmpty().isLength({min: 4, max: 16})
], async (req,res)=>{
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

    // Consulta el usuario
    const usuario = await Usuario.findOne({usuario: req.params.usuario})
                    .populate([
                        {
                            path: 'rol',
                            populate:{path: 'estado'}
                        },
                        {
                            path: 'estado'
                        },
                        {
                            path:'munNotif',
                            populate : [
                                {
                                    path: 'departamento',
                                    populate:  [
                                        {                                
                                            path: 'pais',
                                            populate: 'estado'
                                        },
                                        {
                                            path: 'estado'
                                        }
                                    ]
                                },
                                {
                                    path: 'estado'
                                }
                            ]
                        }
                    ])    
    // Encontro usuario
    if(usuario){
        res.status(201)                
            .send({
                error: false,                        
                content: usuario
            })
    }else{
        res.send({
                error: true,                        
                msj: "Usuario no encontrado"
            })
    }

})


 /*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */
router.post('/registro',[
    check('correo').trim().isEmail().notEmpty(),
    check('nombre').trim().isString().notEmpty().isLength({min: 4}),
    check('contrasena').trim().isString().notEmpty().isLength({min: 4}),
    check('celular').trim().isString().notEmpty().isLength({min: 6}),
    check('usuario').trim().isString().notEmpty().isLength({min: 4, max: 16})    
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
    if(objEstado && objRol){
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
                rol: objRol._id,
                estado: objEstado._id
            })

            try {
                // guarda en BD
                const usuSaved = await usuSave.save()                                               

                if(usuSaved){                    
                    // Se registro correctamente el usuario
                    res.json({
                        error: false,
                        msj: "Usuario registrado."                        
                    })
                }else{
                    // No se logro registrar el usuario
                    res.json({
                        error: true,
                        msj: "No se logró registrar el usuario."                        
                    })
                }
                
            } catch (e) {
                return res.json({
                    error: true,
                    msj: "No se logró registrar el usuario.",
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

/*****************************************************************************
 *                      METHOD PUT
 *********************************************************************** */
router.put('/edicion',[
    check('_id').isMongoId(),
    check('correo').trim().isEmail().notEmpty(),
    check('nombre').trim().isString().notEmpty().isLength({min: 4}),
    check('celular').trim().isString().notEmpty().isLength({min: 6}),
    check('usuario').trim().isString().notEmpty().isLength({min: 4, max: 16}),
    check('recibirNotif').isBoolean(),
    check('tipoSangre').trim().isString().isLength({min:2, max: 3})    
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
    
   // Actualiza 
   const usuAct = await Usuario.findByIdAndUpdate(req.body._id, {
        // Actualiza datos
        correo: req.body.correo,
        nombre: req.body.nombre,
        celular: req.body.celular,
        usuario: req.body.usuario,
        qr: req.body.usuario,
        recibirNotif: req.body.recibirNotif,
        tipoSangre: req.body.tipoSangre,
        foto: req.body.foto,
        munNotif: req.body.munNotif._id
   },{
       // Devuelve el documento con datos modificados
       new: true
   }).populate([
    {
        path: 'rol',
        populate:{path: 'estado'}
    },
    {
        path: 'estado'
    },
    {
        path:'munNotif',
        populate : [
            {
                path: 'departamento',
                populate:  [
                    {                                
                        path: 'pais',
                        populate: 'estado'
                    },
                    {
                        path: 'estado'
                    }
                ]
            },
            {
                path: 'estado'
            }
        ]
    }
]) 

   if(!usuAct){
        return res.json({
            error: true,
            msj: "No se logro actualizar"
        })
   }

   usuAct.contrasena = null

   res.json({
       error: false,
       msj: "Actualización correcta.",
       content: usuAct
   })
})

/***********************************************
 * Actualiza el socketId del usuario
 */
router.put('/updateSocketId',
    [
        check('_id').isMongoId(),
        check('asignar').isBoolean()
    ], async (req,res) => {

       Util.validarErrores(req, res) 

       const siActualizo = await UsuarioCtrl.updateSocketId(req.body, 1)

       if(siActualizo){
           Util.msjSuccess(res,"Socket actualizado")
       }else{
           Util.msjError(res,"No se logró actualizar socketId.")
       }
    }
)

 module.exports = router