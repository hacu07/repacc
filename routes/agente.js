const express = require("express")
const AgenteCtrl = require("../controllers/AgenteCtrl")
const Util = require("../controllers/Util")

const router = express.Router()
const { check, validationResult } = require('express-validator')


/**************************************************************
 * METHOD GET
 **************************************************************/
router.get(
    '/buscar/:idAgente',
    [
        check('idAgente').isMongoId().notEmpty()
    ],
    async (req,res)=>{
        Util.validarErrores(req,res)

        const agente = await AgenteCtrl.findById(req.params.idAgente)

        if(agente != null){
            Util.msjSuccess(res,"Agente encontrado.",agente)
        }else{
            Util.msjError(res,"No se encontró el agente.")
        }
    }
)

/**************************************************************
 * METHOD POST
 **************************************************************/

 /*************************************************
  * Cambia el estado de un agente
  */
 router.post(
     '/estado',
     [
         check('_id').isMongoId(),
         check('disponible').isBoolean(),
         check('latitud').isNumeric(),
         check('longitud').isNumeric()
     ],
     async (req, res) =>{
         Util.validarErrores(req,res)

         const estado = await AgenteCtrl.cambiarEstado(req.body)

         if(estado != null){
            Util.msjSuccess(res,"Estado actualizado.",estado)
         }else{
             Util.msjError(res,"No se logro cambiar estado.")
         }
     }
 )

 /*****************************************
  * Registra el agente con los datos enviados
  */
router.post(
    '/registro',
    [
        check("usuario._id").isMongoId().notEmpty(),
        check("usuaReg._id").isMongoId().notEmpty(),
        check("municipio._id").isMongoId().notEmpty(),
        check("entidad._id").isMongoId().notEmpty(),
        check("servicio").isString().notEmpty()
    ],
    async (req,res) =>{
        Util.validarErrores(req,res)

        const agente = await AgenteCtrl.save(req.body)

        if(agente != null){
            Util.msjSuccess(res,"Registro exitoso.")
        }else{
            Util.msjError(res,"No se logró registrar el agente.")
        }
    }
)

module.exports = router
