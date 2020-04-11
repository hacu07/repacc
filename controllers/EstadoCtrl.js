const Estado = require("../models/estado")

/***********************************************************
 * Retorna documento del estado segun codigo si lo encontro
 ********************************************************** */
async function buscarEstado(codigo){
    var estado = null;

    if(codigo){
         estado = await Estado.findOne({codigo: codigo}, '_id codigo nombre descripcion')
    }

    return estado;
}

exports.buscarEstado = buscarEstado