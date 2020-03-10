const express = require('express')
const Pais = require('../models/pais')


// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */

 /*
 * Retorna los estados registrados
 */
router.get('/paises', async (req,res)=>{
    const pais = await Pais.find(null,'_id codigo nombre prefijoTel')
    
    let jsonRespuesta = null
    
    if(pais.length != 0){
        jsonRespuesta = {
            error: false,
            content: pais
        }
    }else{
        jsonRespuesta = {
            error: true,
            msj: "No se logro obtener listado de paises"
        }
    }

    res.json(jsonRespuesta)
})


 /*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */
router.post('/',
    [check('codigo').isString(),
    check('nombre').isString(),        
    check('prefijoTel').isString()],
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
            const objPais = new Pais({
                codigo: req.body.codigo,
                nombre: req.body.nombre,
                estado: objEstado._id,
                prefijoTel: req.body.prefijoTel
            })

            //guarda en BD
            try {
                const objPaisSave =  await objPais.save()

                // Si guardo...
                if(objPaisSave){
                    res.json({
                        error: false,
                        content: objPaisSave
                    })
                }else{
                    res.json({
                        error: true,
                        msj: "No se logró registrar el pais."
                    })    
                }
            } catch (exp) {
                res.json({
                    error: true,
                    msj: "Error al registrar el pais."
                })
            }
        }else{
            res.json({
                error: true,
                msj: "No se logro registrar pais, estado no encontrado."
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