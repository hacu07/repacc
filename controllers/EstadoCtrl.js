const Estado = require("../models/estado")

/***********************************************************
 * Retorna documento del estado segun codigo si lo encontro
 ********************************************************** */
async function buscarEstado(codigo){
    var estado = null;

    if(codigo){
         estado = await Estado.findOne({codigo: codigo}, '_id codigo nombre descripcion tipo orden')
    }

    return estado;
}

/*******************************************
 * Retorna consulta de documento segun query enviada
 */
async function buscar(query){
    let estados = null

    try {
        let result = await Estado.find(query)

        if(result != null && result.length > 0){
            estados = result
        }
    } catch (error) {
        //ignore
    }
    return estados
}


/***********************************************************
 * Retorna documento del estado segun codigo si lo encontro
 ********************************************************** */
async function findById(idEstado){
    var estado = null;

    estado = await Estado.findById({_id: idEstado}, '_id codigo nombre descripcion tipo orden')
    
    return estado;
}

exports.buscarEstado = buscarEstado
exports.findById = findById
exports.buscar = buscar