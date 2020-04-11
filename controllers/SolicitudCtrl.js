const Solicitud = require("../models/solicitud")
const Contacto = require("../models/contacto")


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

exports.actEstSol = actEstSol