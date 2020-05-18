const express = require('express')
const ServicioCtrl = require('../controllers/ServicioCtrl')
const TipoCtrl = require('../controllers/TipoCtrl')
const Util = require('../controllers/Util')
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

module.exports = router