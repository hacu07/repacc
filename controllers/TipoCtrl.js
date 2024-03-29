const Tipo = require('../models/tipo')
const EstadoCtrl = require('../controllers/EstadoCtrl')
const Util = require('./Util')

async function registrarTipo(tipo, codigo, nombre, descripcion){
    var siRegistro = false

    try {
        //Obtiene el estado activo que se asigna por defecto
        const objEstado = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_ACTIVO)

        if(objEstado != null){
            //Objeto a registrar
            const objTipo = new Tipo({
                tipo: tipo,
                codigo: codigo,
                nombre: nombre,
                estado: objEstado._id,
                descripcion: descripcion
            })

            const tipoSave = await objTipo.save()

            if(tipoSave){
                siRegistro = true
            }
        }
    } catch (error) {
        
    }

    return siRegistro
}


async function buscarTipo(tipo){
    var resultado = null

    try {
        resultado = await Tipo.find({tipo: tipo}, "_id tipo codigo nombre estado descripcion").populate([
            {
                path: "estado",
                select: "_id codigo nombre tipo descripcion"
            }
        ])
    } catch (error) {
        
    }

    return resultado
}

exports.registrarTipo = registrarTipo
exports.buscarTipo = buscarTipo