const EstadoCtrl = require("./EstadoCtrl")
const Util = require("./Util")
const Agente = require("../models/agente")
const MunicipioCtrl = require("./MunicipioCtrl")
const EntidadCtrl = require("./EntidadCtrl")
const UsuarioCtrl = require("./UsuarioCtrl")
/******************************
 * Busca agente segun id
 */
async function findById(idBusq, opcBusq = 1){
    let agente = null

    let objAgente = null
    try {
        switch (opcBusq) {
            // Busca por idAgente
            case 1:
                objAgente =  await Agente.findById(idBusq, "_id estado municipio entidad usuario latitud longitud servicio")       
                break;        
            // Busca por idUsuario
            case 2:
                objAgente =  await Agente.findOne({usuario: idBusq}, "_id estado municipio entidad usuario latitud longitud servicio")
                break;
        }        
                
        if(objAgente){
            objAgente.estado = await EstadoCtrl.findById(objAgente.estado)
            objAgente.municipio = await MunicipioCtrl.getTownById(objAgente.municipio)
            objAgente.entidad = await EntidadCtrl.findById(objAgente.entidad)
            objAgente.usuario = await UsuarioCtrl.findById(objAgente.usuario)

            agente = objAgente
        }

    } catch (error) {
        //ignore        
    }

    return agente
}

/*********************************************
 * Cambia el estado del agente
 * Retorna estado al cual se cambio
 * HAROLDC 27/05/2020
 */
async function cambiarEstado(body){
    let estado = null

    try {
        let objEstd = await EstadoCtrl.buscarEstado(body.disponible ? Util.ESTADO_CODIGO_ACTIVO : Util.ESTADO_CODIGO_INACTIVO)

        if(objEstd){
            const objAgente = await Agente.findByIdAndUpdate(body._id,{
                estado: objEstd._id,
                latitud: body.disponible ? body.latitud : 0,
                longitud: body.disponible? body.longitud : 0
            })

            if(objAgente){                
                estado = objEstd
            }
        }
    } catch (error) {
        //ignore
    }

    return estado 
}

/**********************************
 * Actualiza los datos de un agente
 * HAROLDC 03/08/2020
 */
async function updateAgent(objAgent){
    let siActualizo = false
    
    try {
        const objAgentUpdated = await Agente.findByIdAndUpdate({_id: objAgent._id},objAgent,{new:true})                
        if(objAgentUpdated){            
            siActualizo = true
        }
                                        
    } catch (error) {
        // ignore error        
    }
    
    return siActualizo
}

/**********************************
 * Registra agente
 * HAROLDC 26/05/2020
 */
async function save(body){
    let agenteSave = null

    try {
        const estadoDisp = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_INACTIVO)

        if(estadoDisp){
            const objAgente = new Agente({
                usuario: body.usuario._id,
                estado: estadoDisp._id,
                municipio: body.municipio._id,
                entidad: body.entidad._id,
                usuaReg: body.entidad._id,
                servicio: body.servicio
            })

            const agente = await objAgente.save()

            if(agente){
                agenteSave = agente
            }
        }
    } catch (error) {
        //ignore
    }

    return agenteSave
}

/***********************************************************
 * Retorna listado de agentes disponibles 
 * en el municipio segun el codigo del servicio enviado
 */
async function obtenerAgentesDisponibles(idMunicipio, codigoServicio){
    let agentes = null

    try {

        const estadoDisp = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_ACTIVO)

        if(estadoDisp){
            const listDisp = await Agente.find({
                    municipio: idMunicipio,
                    servicio: codigoServicio,
                    ocupado : false
                    }, 
                    "_id latitud longitud usuario"
                ).populate([
                    {
                        path: 'usuario',
                        select: '_id socketId'
                    }
                ])
            
            
            // Si encontro resultados
            if(listDisp.length > 0){
                agentes = listDisp
            }
        }

    } catch (error) {
        //ignore
    }

    return agentes
}


exports.save = save
exports.findById = findById
exports.cambiarEstado = cambiarEstado
exports.obtenerAgentesDisponibles = obtenerAgentesDisponibles
exports.updateAgent = updateAgent