const express = require('express')
const ServicioCtrl = require('../controllers/ServicioCtrl')
const TipoCtrl = require('../controllers/TipoCtrl')
const Util = require('../controllers/Util')
const EstadoCtrl = require('../controllers/EstadoCtrl')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');


/***************************************************************
 *              GET METHOD
 **************************************************************/

 /*
 *  Retorna los servicios con estado activo
 */
router.get(
    '/obtener/',
    async (req,res) =>{
        // Busca los servicios identificados en la coleccion "Tipo" con el codigo 20
        const servicios = await TipoCtrl.buscarTipo(20)

        if(servicios != null){
            if(servicios.length > 0){
                Util.msjSuccess(res, "Servicios encontrados.", servicios)
            }else{
                Util.msjError(res, "No se encontraron servicios registrados.")
            }            
        }else{
            Util.msjError(res, "No se logró consultar los servicios.")
        }
    }
)

/*
    Retorna estados de un servicio
*/
router.get(
    '/estados/',
    async (req,res) =>{
        let estados = await EstadoCtrl.buscar({tipo: 4, orden : {$gt : 0}})

        if(estados != null){
            Util.msjSuccess(res, "Estados del servicio.", estados)
        }else{
            Util.msjError(res, "No se logró obtener los estados del servicio")
        }
    }
)


/******************************************************************
 * PUT METHOD
 */

 /**
  * Actualiza el estado del servicio por un agente asignado
  */
 router.put(
     '/actualizar/',
     [
        check("servicio._id").isMongoId(),
        check("estado._id").isMongoId(),
        check("agente._id").isMongoId()
     ], 
     async (req,res) =>{
        Util.validarErrores(req,res)

        let siActualizo = await ServicioCtrl.actualizarServicio(req.body)

        if(siActualizo){
            Util.msjSuccess(res,"Servicio actualizado.")
        }else{
            Util.msjError(res,"No se logro actualizar el servicio.")
        }
     }
 )

module.exports = router