const express = require('express')
const Estado = require('../models/estado')
const Solicitud = require('../models/solicitud')
const Contacto = require("../models/contacto")
const EstadoCtrl = require('../controllers/EstadoCtrl')
const SolicitudCtrl = require('../controllers/SolicitudCtrl')
const ContactoCtrl = require('../controllers/ContactoCtrl')
const Util = require('../controllers/Util')
// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');

/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */

/*  Busca las solicitudes de pendientes por aceptar del usuario
 *  HAROLDC 17/02/2020 
 */
router.get(
    "/:iduser",
    [check("iduser").isMongoId()],
    async (req,res)=>{
        // Si ocurrio un error en validación de parametros
        Util.validarErrores(req,res)

        //No encontro errores en los parametros

        const estT2N = await EstadoCtrl.buscarEstado("T2N")

        if(!estT2N){
            return res.json({
                error: true,
                msj: "Estado T2N no configurado."
            })
        }

        // Busca la solicitudes del usuario
        const solicitudes = await Solicitud.find({ contacto: req.params.iduser, estado: estT2N._id}, "usuario estado")
                            .populate([
                                {
                                    path: 'usuario',
                                    select : '_id nombre usuario foto tipoSangre'                                 
                                },
                                {
                                    path: 'estado',
                                    select: ' _id codigo nombre'
                                }
                            ])
        
        // Encontro solicitudes
        if(solicitudes.length > 0){
            res.json({
                error: false,
                content: solicitudes
            })
        }else{
            // No se encontraron solicitudes
            res.json({
                error: true,
                msj: "No se encontraron solicitudes."
            })
        }
    })

/*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */

 /*
 *  Registra el envio de solicitud
 */
router.post(
    "/registrar",
    [
        check("usuario").isMongoId(),
        check("contacto").isMongoId()
    ], 
    async (req, res)=>{
        // Si ocurrio un error en validación de parametros
        Util.validarErrores(req,res)
        //No encontro errores en los parametros

        //Obtiene estado a asignar por defecto "NO ACEPTADO"

        const estado = await Estado.findOne({codigo: "T2N"})

        // No encontro estado
        if(!estado){ 
            return res.json({error: true, msj: "Estado por defecto no encontrado."})
        }

        const solicitud = new Solicitud({
            usuario: req.body.usuario ,// Envia la solicitud
            contacto: req.body.contacto,
            estado: estado._id
        })

        try {
            const soliSave = await solicitud.save()

            // Guardo correctamente
            if(soliSave){
                res.json({
                    error: false,
                    msj: "Solicitud enviada."
                })
            }else{
                res.json({
                    error: true,
                    msj: "No se logro enviar la solicitud. Intente de nuevo."
                })
            }
        } catch (error) {
            res.json({
                error: true,
                msj: "Error al enviar solicitud... Intente mas tarde."
            })
        }
    }
)


/***********************************************************************************
 *                      METHOD PUT
 ****************************************************************************/

/**
 * Registra si acepto o no la solicitud
 * Si la acepto agrega el registro en contacto
 */
router.put(
    '/cambiarEstado',
    [
        check('idSolicitud').isMongoId(),        
        check('aceptado').isBoolean()
    ], async (req,res) =>{
        // Si ocurrio un error en validación de parametros
        Util.validarErrores(req,res)
        //No encontro errores en los parametros

        const err = "No se logro agregar contacto."
        const estado = await EstadoCtrl.buscarEstado( req.body.aceptado ? "T2A" : "T2R")

        // Encontro el estado a actualizar
        if(estado){            

            // Si actualizo correctamente 
            const solAct = await SolicitudCtrl.actEstSol(req.body.idSolicitud, estado._id)
            if(solAct){
                // Debe agregar a contactos porque se acepto la solicitud
                if(req.body.aceptado){
                    // Registra en contactos
                    const objContact = await ContactoCtrl.registrar(solAct.usuario._id, solAct.contacto._id )

                    if(objContact != null){
                        Util.msjSuccess(res, "Contacto agregado", objContact)
                    }else{
                        // No se logro registrar contacto desps de haber cambiado su estado en solicitud    
                        Util.msjError(err)              
                    }
                }else{
                    // El usuario rechazo la solicitud
                    Util.msjSuccess(res,"Solicitud rechazada",null)
                }
                
            }else{ 
                // No logro actualizar
                Util.msjError(err)
            }
        }else{
            Util.msjError(res, err)
        }
    }
)

module.exports = router