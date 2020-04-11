const express = require('express')
const ContactoCtrl = require('../controllers/ContactoCrl')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');


/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */

/*  Busca los contactos del usuario
 *  HAROLDC 18/02/2020 
 */
router.get(
    '/buscar/:idUsuario',
    [check('idUsuario').isMongoId()],
    async (req,res)=>{
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

        const contactos = await ContactoCtrl.buscarContactos(req.params.idUsuario)

        if(contactos.length > 0){
            // Encontro contactos
            res.json({
                error: false,
                content: contactos
            })
        }else{
            res.json({
                error: false,
                msj: "Aun no tienes contactos."
            })
        }

    })


/*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */

/*  registra contacto 
 *  HAROLDC 18/02/2020 
 */
router.post(
    '/registro',
    [
        check("idUsuario").isMongoId(),
        check("idContacto").isMongoId()
    ],
    async (req,res)=>{
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

        const objContacto = await ContactoCtrl.registrar(req.body.idUsuario, req.body.idContacto)        
        if(objContacto){
            res.json({
                error: false,
                msj: "Contacto agregado."
            })
        }else{
            res.json({
                error: true,
                msj: "No se logro registrar el contacto."
            })
        }
    }
)

module.exports = router