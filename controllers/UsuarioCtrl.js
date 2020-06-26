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

exports.findById = findById