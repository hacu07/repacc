const Solicitud = require("../models/solicitud")
const EstadoCtrl = require("../controllers/EstadoCtrl")
const Util = require("./Util.js")

/**
 * Actualiza estado de la solicitud
 * retorna objeto actualizado
 */
async function actEstSol(idSol, idEst){
    const solAct = await Solicitud.findByIdAndUpdate(idSol,{
        estado : idEst
    },{
        new: true
    })

    return solAct
}


/************************************
 * Obtiene las solicitudes donde se encuentra registrado un usuario
 * asi sea el que la envio o el que la recibe
 * HAROLDC 10/10/2020
 */
async function obtenerSolicitudesPorUsuario(userId){
    let solicitudes = null

    let estadoNoAceptado = await EstadoCtrl.buscarEstado(Util.ESTADO_SOLICITUD_NO_ACEPTADO)
    if(userId != null && estadoNoAceptado){
        let response = await Solicitud.find(
            {
                estado : estadoNoAceptado._id,
                $or: [{usuario: userId}, {contacto: userId}]
            }
        )

        if(response.length > 0){
            solicitudes = response
        }
    }

    return solicitudes 
}

exports.actEstSol = actEstSol
exports.obtenerSolicitudesPorUsuario = obtenerSolicitudesPorUsuario