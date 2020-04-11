const express = require('express')
const Departamento = require('../models/departamento')
const Estado = require("../models/estado")

// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */
router.get('/:idpais', async (req,res)=>{
    // Consulta los departamentos segun el pais enviado por parametro
    Departamento.find({pais: req.params.idpais},'_id codigo nombre', (err,docs)=>{
        // callback 
        if(err) return res.json({error: true, msj: "Error al obtener departamentos"})

        if(docs.length == 0){ // No encontro resultados
            return res.json(
                {                
                    error: true,
                    msj: "No se encontraron resultados"
                }
            );
        }
        // Si encontro los estados por el tipo
        res.json({
            error: false,              
            content: docs
        })
    }).populate([
        {
            path: 'pais',
            populate: { path : 'estado' } 
        },
        {
            path : 'estado'
        }
    ])
})


 /*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */
router.post('/',
    [check('codigo').isString(),
    check('nombre').isString(),
    check('pais').isMongoId()],
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
            const objDpto = new Departamento({
                codigo: req.body.codigo,
                nombre: req.body.nombre,
                pais: req.body.pais,
                estado: objEstado._id
            })

            //guarda en BD
            try {
                const objDptoSave =  await objDpto.save()

                // Si guardo...
                if(objDptoSave){
                    res.json({
                        error: false,
                        content: objDptoSave
                    })
                }else{
                    res.json({
                        error: true,
                        msj: "No se logró registrar el departamento."
                    })    
                }
            } catch (exp) {
                res.json({
                    error: true,
                    msj: "Error al registrar el departamento."
                })
            }
        }else{
            res.json({
                error: true,
                msj: "No se logro registrar departamento, estado no encontrado."
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