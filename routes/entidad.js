const express = require("express")
const EntidadCtrl = require("../controllers/EntidadCtrl")
const Util = require("../controllers/Util")

const router = express.Router()
const { check, validationResult } = require('express-validator');
const Entidad = require("../models/entidad");

/**************************************************************
 * METHOD GET
 **************************************************************/

 //Retorna las entidades disponibles del municipio
router.get(
    '/:_idMunicipio',
    [
        check('_idMunicipio')
    ],
    async(req,res)=>{
        Util.validarErrores(req,res)

        const entidades = await EntidadCtrl.buscarClinicasMunicipio(req.params._idMunicipio)

        if(entidades != null){
            Util.msjSuccess(res,"Entidades del municipio.",entidades)
        }else{
            Util.msjError(res,"No se encontraron entidades en el municipio.")
        }
    }
)

/**************************************************************
 * METHOD POST
 **************************************************************/
router.post(
    '/registro'
    ,[
        check("nit").isString().notEmpty(),
        check("nombre").isString().notEmpty(),
        check("direccion").isString().notEmpty(),
        check("municipio._id").isMongoId().notEmpty(),
        check("latlong").isString().notEmpty(),
        check("latitud").isNumeric().notEmpty(),
        check("longitud").isNumeric().notEmpty(),
        check("usuario._id").isMongoId().notEmpty(),
        check("tipo._id").isMongoId().notEmpty()
    ],
    async (req,res)=>{
        Util.validarErrores(req, res)

        const entidad = await EntidadCtrl.save(req.body)

        if(entidad != null){
            Util.msjSuccess(res,"Registro exitoso.")
        }else{
            Util.msjError(res,"No se logró registrar la entidad.")
        }
    }
)

module.exports = router