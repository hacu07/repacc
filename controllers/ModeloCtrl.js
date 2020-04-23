/****
 * Controlador del model "Modelo"
***/
const Modelo = require("../models/modelo")
const EstadoCtrl = require("./EstadoCtrl")
const Util = require("./Util")


async function registrarModelo(nombreModelo, idMarca){
    var siRegistro = false

    //Obtiene estado activo para asignar por defecto
    // Obtiene Estado Activo
    const estT2A = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_ACTIVO)


    try {
        //Registra el modelo
        const objModelo = new Modelo({
            nombre: nombreModelo,
            marca: idMarca,
            estado: estT2A
        })

        const modSave = objModelo.save()

        if(modSave){
            siRegistro = true
        }
    } catch (error) {
        
    }

    return siRegistro
}


exports.registrarModelo = registrarModelo