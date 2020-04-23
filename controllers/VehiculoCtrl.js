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


exports.registrarVehiculo = registrarVehiculo