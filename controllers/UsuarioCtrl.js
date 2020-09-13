const Usuario = require("../models/usuario")
const MunicipioCtrl = require("./MunicipioCtrl")

async function findById(idUsuario){
    var usuario = null

    try {
        const objUsuario = await Usuario.findById(idUsuario, "_id codRecuCon recibirNotif qr correo nombre celular usuario rol estado foto")
                .populate([
                    {
                        path: 'rol',
                        populate:{path: 'estado'}
                    },
                    {
                        path: 'estado'
                    }
                ])
        
        if(objUsuario){
            objUsuario.municipio = await MunicipioCtrl.getTownById(objUsuario.municipio)
            usuario = objUsuario
        }
    } catch (error) {
        //ignore
        console.log(error)
    }

    return usuario
}

/*************************************************+
 * Actualiza el SocketId del usuario
 * HAROLDC 23/08/2020
 */
async function updateSocketId(body, opcBus){
    let siActualizo = false
    let objBusq = null
    let objActu = null
    let usuAct
    try {
        
        switch (opcBus) {
            // Actualiza por peticion del usuario
            case 1:
                objActu = {
                    _id : body._id,
                    socketId : body.asignar ? body.socketId :  null
                }

                objBusq = {
                    _id : objActu._id
                }

                // Buscar por _Id y asigna el socketId
                usuAct = await Usuario.findByIdAndUpdate(objBusq,
                    objActu,
                    {
                        new: true
                    })
                break;

            // Actualiza por desconexion del socket
            case 2:
            
                objActu = {
                    socketId: null
                }

                objBusq = {
                    socketId : body.socketId
                }

                // Busca por socketId y lo vuelve nulo
                usuAct = await Usuario.findOneAndUpdate(objBusq,
                    objActu,
                    {
                        new: true
                    })
                break
        }                
        
        if(usuAct){
            siActualizo = true
        }

    } catch (error) {
        //ignore error
        console.log(error)
    }

    return siActualizo
}

exports.findById = findById
exports.updateSocketId = updateSocketId