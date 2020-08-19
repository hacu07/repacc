const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const Util = require("../controllers/Util")
const ReporteCtrl = require("../controllers/ReporteCtrl")


/*******************************************************
 *  GET METHOD
 *******************************************************/

/*
    Retorna los reportes asignados a un agente de transito
 */
router.get(
    '/reportes/:_idAgente',
    [
        check('_idAgente').isMongoId()
    ],
    async (req,res) =>{
        Util.validarErrores(req,res)

        let reportes = await ReporteCtrl.buscarReporteAgente(req.params._idAgente)

        if(reportes != null){
            Util.msjSuccess(res,"Reportes encontrados.", reportes)
        }else{
            Util.msjError(res,"No se encontraron reportes.")
        }
    }
)

/*
    Retorna datos basicos de los ultimos 21 reportes segun 
    el municipio indicado
    Autor: HAROLDC
    Fecha: 09/05/2020
*/
router.get(
    '/basicInfo/:idTown',
    [
        check("idTown").isMongoId()
    ],
    async (req,res)=>{
        Util.validarErrores(req,res)

        const listReports = await ReporteCtrl.getBasicInfoReports(req.params.idTown)

        if(listReports != null){
            if(listReports.length > 0){
                Util.msjSuccess(res,"Reportes encontrados",listReports)
            }else{
                Util.msjError(res,"No se encontraron reportes.")
            }
            
        }else{
            Util.msjError(res,"No se logró obtener los reportes.")
        }
    }
)

/*
    Retorna datos basicos de reportes segun 
    el municipio indicado y el codigo
    Autor: HAROLDC
    Fecha: 01/08/2020
*/
router.get(
    '/basicInfo/:idTown/:codigo',
    [
        check("idTown").isMongoId(),
        check("codigo").isString().notEmpty()
    ],
    async (req,res)=>{
        Util.validarErrores(req,res)

        const listReports = await ReporteCtrl.getBasicInfoReports(req.params.idTown, req.params.codigo)

        if(listReports != null){
            if(listReports.length > 0){
                Util.msjSuccess(res,"Reportes encontrado",listReports)
            }else{
                Util.msjError(res,"No se encontraron reportes.")
            }
            
        }else{
            Util.msjError(res,"No se logró obtener el reporte.")
        }
    }
)

/*
    Retorna informacion del reporte seleccionado
    el municipio indicado
    Autor: HAROLDC
    Fecha: 09/05/2020
*/
router.get(
    '/valido/:idReporte',
    [
        check("idReporte").isMongoId()
    ],
    async (req,res)=>{
        Util.validarErrores(req,res)

        const reporte = await ReporteCtrl.findById(req.params.idReporte)

        if(reporte != null){
            Util.msjSuccess(res,"Reporte encontrado.", reporte)
        }else{
            Util.msjError(res, "No se logró obtener el reporte.")
        }
    }
)

/*******************************************************
 *  POST METHOD
 *******************************************************/
router.post(
    '/registro/',
    [
        check('latlong').isLatLong(),
        check('direccion').isString().notEmpty(),
        check('numHeridos').isNumeric(),
        check('usuarioReg._id').isMongoId(),
        check('pais').isString().notEmpty(),
        check('departamento').isString().notEmpty(),
        check('municipio').isString().notEmpty(),
        check('placas').isArray().notEmpty()
    ],
    async (req,res)=>{        
        Util.validarErrores(req,res)

        const objReporte = await ReporteCtrl.registroReporte(req.body)

        if(objReporte != null){
            Util.msjSuccess(res,"Codigo del reporte: " + objReporte.codigo, objReporte)
        }else{
            Util.msjError(res,"No se logró reportar.")
        }
    })

/*************************************************
 * Usuario de rol AGENTE actualiza el estado del reporte.
 * HAROLDC 31/05/2020
 */
router.put(
    '/estado/',
    [
        check('_id').isMongoId(),
        check('agenteFalAlarm._id').isMongoId(),
        check('esFalAlarm').isBoolean()
    ],
    async (req,res) =>{
        Util.validarErrores(req,res)

        const siActualizo = await ReporteCtrl.actualizarEstado(req.body)

        if(siActualizo){
            Util.msjSuccess(res,"Estado actualizado.")
        }else{
            Util.msjError(res,"No se logro actualizar el estado.")
        }   
    }
    
)

/***********************************************
 * Actualiza la imagen del reporte una vez se ha cargado en firebase storage
 * HAROLDC 11/08/2020
 */
router.put(
    '/cargarImagen/',
    [
        check('_id').isMongoId(),
        check('imagen').isString().notEmpty()
    ],
    async (req,res) => {
        Util.validarErrores(req,res)

        const siActualizo = await ReporteCtrl.actualizarImagen(req.body)

        if(siActualizo){
            Util.msjSuccess(res,"Imagen actualizada.")
        }else{
            Util.msjError(res,"No se logro actualizar la imagen.")
        }
    }

)

module.exports = router