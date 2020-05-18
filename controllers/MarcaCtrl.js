/****
 * Controlador del modelo "Marca"
***/
const Marca = require("../models/marca")


async function obtenerMarcas(idTipo){
    var marcas = null

    try {
        marcas = await Marca.find({tipo : idTipo}, "_id nombre estado tipo").populate([
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
        ])
    } catch (error) {
        
    }

    return marcas
}

/**
 * 
 * @param {*} nombre = Nombre de la marca a registrar
 * @param {*} estT2A = Objeto del Modelo Estado, Objeto que indica el estado activo
 */
async function registrarMarca(nombre, idTipo, estT2A){
    var siRegistro = false

    const objMarca = new Marca({
        nombre: nombre.trim(),
        estado: estT2A._id,
        tipo: idTipo
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
exports.obtenerMarcas = obtenerMarcas