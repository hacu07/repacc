const express = require('express')
const Tipo = require('../models/tipo')


// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */



 /*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */
router.post('/',
    [check('nombre').isString().notEmpty(),
    check('descripcion').isString().notEmpty(),
    check('tipo').isNumeric(),
    ],
    async (req, res)=>{

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

    // Asigna estado activo por defecto
    Estado.find({tipo: 1,nombre: "ACTIVO"}, async (err, objEstado)=>{
        //ocurrio error al buscar
        if(err){
            return res.json({
                error: true,
                msj: 'Error al obtener estado ha asignar al rol'
            })
        }

        // No ocurrio error al buscar estado 
        if(objEstado){
            const objMuni = new Municipio({
                codigo: req.body.codigo,
                nombre: req.body.nombre,
                departamento: req.body.departamento,
                estado: objEstado._id,
                capital: req.body.capital
            })

            //guarda en BD
            try {
                const objMuniSave =  await objMuni.save()

                // Si guardo...
                if(objMuniSave){
                    res.json({
                        error: false,
                        content: objDptoSave
                    })
                }else{
                    res.json({
                        error: true,
                        msj: "No se logró registrar el municipio."
                    })    
                }
            } catch (exp) {
                res.json({
                    error: true,
                    msj: "Error al registrar el municipio.",
                    errors: exp
                })
            }
        }else{
            res.json({
                error: true,
                msj: "No se logro registrar municipio, estado no encontrado."
            })
        }
    })
})   


 /*****************************************************************************
 *                      METHOD PUT
 *********************************************************************** */



 /*****************************************************************************
 *                      METHOD DELETE
 *********************************************************************** */


module.exports = router