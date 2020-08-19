const Vehiculo = require('../models/vehiculo')


async function registrarVehiculo(objVehiculo){
    var siRegistro = false

    try {
        const vehiculoSave = await objVehiculo.save()

        if(vehiculoSave){
            siRegistro = true
        }
    } catch (error) {
        
    }

    return siRegistro
}

/**
 * Busca los vehiculos registrados por un usuarios
 * @param {*} idUsuario 
 */
async function buscarVehiculos(idUsuario){
    var listaVehiculos = null
    
    try {
        listaVehiculos = await Vehiculo.find({usuario: idUsuario}, '_id colores tipo esParticular modelo placa foto')
        .populate([
            {
                path: 'tipo',
                select: '_id tipo codigo nombre estado',
                populate:[
                    {
                        path: 'estado',
                        select: '_id codigo nombre tipo'
                    }
                ]
            },
            {
                path: 'modelo',
                select: '_id nombre marca estado',
                populate: [
                    {
                        path: 'marca',
                        select: '_id nombre estado ',
                        populate: [
                            {
                                path: 'estado',
                                select: '_id codigo nombre tipo'
                            }
                        ]
                    },
                    {
                        path: 'estado',
                        select: '_id codigo nombre tipo'
                    }
                ]
            }
        ])
    } catch (error) {
        
    }

    return listaVehiculos
}


/**********************************************************
 * Obtiene obj vehiculo segun placa, retorna objeto vehiculo
 * HAROLDC 02/06/2020
 */
async function buscarVehiculoPorPlaca(placa){
    let vehiculo = null

    try {
        const objVeh = await Vehiculo.findOne({placa: placa}, "_id usuario")

        if(objVeh){
            vehiculo = objVeh
        }
    } catch (error) {
        // ignore
    }

    return vehiculo 
}

exports.buscarVehiculos = buscarVehiculos
exports.registrarVehiculo = registrarVehiculo
exports.buscarVehiculoPorPlaca = buscarVehiculoPorPlaca