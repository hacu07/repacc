/****
 * Controlador del modelo "Marca"
***/
const Marca = require("../models/marca")


/**
 * 
 * @param {*} nombre = Nombre de la marca a registrar
 * @param {*} estT2A = Objeto del Modelo Estado, Objeto que indica el estado activo
 */
async function registrarMarca(nombre, estT2A){
    var siRegistro = false

    const objMarca = new Marca({
        nombre: nombre.trim(),
        estado: estT2A._id
    })

    // Registra marca en BD
    try {
        const marcaSave = await objMarca.save()

        if(marcaSave){
            siRegistro = true
        }
    } catch (error) {
        // Error al registrar marca
    }

    return siRegistro
}

exports.registrarMarca = registrarMarca