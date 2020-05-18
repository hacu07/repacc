/****
 * Controlador del model "Modelo"
***/
const Modelo = require("../models/modelo")
const EstadoCtrl = require("./EstadoCtrl")
const Util = require("./Util")


async function obtenerModelos(idMarca){
    var modelos = null

    try {

        const estT2A = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_ACTIVO)

        modelos = await Modelo.find({marca: idMarca, estado: estT2A._id }, '_id nombre marca estado').populate([
            {
                path: 'marca',
                select: '_id nombre estado tipo',
                populate: [
                    {
                        path: 'estado',
                        select: '_id codigo nombre tipo'
                    },
                    {
                        path: 'tipo',
                        select: '_id tipo codigo nombre estado',
                        populate:[
                            {
                                path: 'estado',
                                select: '_id codigo nombre tipo'
                            }
                        ]
                    }
                ]
            },
            {
                path: 'estado',
                select: '_id codigo nombre tipo'
            }
        ])
    } catch (error) {
        
    }

    return modelos 
}


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
exports.obtenerModelos = obtenerModelos