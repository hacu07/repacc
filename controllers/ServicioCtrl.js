const Servicio = require("../models/servicio")
const EstadoCtrl = require("../controllers/EstadoCtrl")
const Util = require("../controllers/Util")
const AgenteCtrl = require("../controllers/AgenteCtrl")
const UsuarioCtrl = require("../controllers/UsuarioCtrl")
const TipoCtrl = require("../controllers/TipoCtrl")
const AgenRepo = require("../models/agenRepo")
const Notificacion = require("../models/notificacion")
const {app} = require("../app/app")

/**
 * Una vez el reporte ha sido registrado, registra los servicios indicados por el usuario
 * @param {*} objReporte Objeto reporte registrado
 * @param {*} servicios Array de objetos Servicios
 */
async function registrarServicios(objReporte, servicios){
    const estadoNoAtendido = await EstadoCtrl.buscarEstado(Util.ESTADO_SERVICIO_NOATENDIDO)
    if(estadoNoAtendido){
        servicios.forEach(servicio => {
            // registra cada servicio
            try {
                const objServicio = new Servicio({
                    reporte: objReporte._id,
                    tipo: servicio._id,
                    estado: estadoNoAtendido._id
                })

                const objSave = objServicio.save()

                if(objSave){
                    // Notifica a los agentes disponibles                                         
                    reportarServiciosAgentes(objReporte,objServicio)
                    .then(tipo => {})
                    .catch(err => {})
                }
            } catch (error) {
                //ignore
            }
        });
    }
}

/****
 * Notifica a los agentes sobre el reporte registrado
 * Segun el tipo de servicio busca los agentes disponibles 
 * en el municipio reportado y les notifica el reporte para que
 * acudan a atenderlo.
 */
async function reportarServiciosAgentes(reporte, objServicio){

    try {
        // Obtiene el servicio (Tipo)
        const io = app.get("socket") 
        let objTipo = await TipoCtrl.findById(objServicio.tipo)
        const estNotifAct = await EstadoCtrl.buscarEstado(Util.ESTADO_SERVICIO_NOATENDIDO)        
        if(objTipo != null && estNotifAct != null){        
            let agentesDisp = await AgenteCtrl.obtenerAgentesDisponibles(reporte.municipioReg._id, objTipo.codigo)               
            // Si encontro agentes disponibles en el municipio del reporte            
            if(agentesDisp != null  && agentesDisp.length > 0){
                
                // Obtiene agente mas cercano al sitio del reporte
                const agenteNotif = await obtenerAgenteNotif(reporte, agentesDisp)

                if(agenteNotif != null){

                    // Crea objeto AgenRepo y lo almacena
                    const agenRepo = new AgenRepo({
                        servicio: objServicio._id,
                        agente: agenteNotif._id,
                        estado: estNotifAct._id
                    })
                    
                    const registro = await agenRepo.save()
                    
                    // Si registro el agente al servicio del reporte, 
                    // realiza notificacion
                    if(registro){

                        // Cambia propiedad del Agente a ocupado para que no le asignen mas reportes                                                
                        agenteNotif.ocupado = true
                        await AgenteCtrl.updateAgent(agenteNotif)
                        

                        // Notifica al agente
                        let tipoNotifApp = await TipoCtrl.buscarTipoSegunCodigo(Util.NOTIFICACION_APP)
                        let tipoNotifSMS = await TipoCtrl.buscarTipoSegunCodigo(Util.NOTIFICACION_SMS)
                        let estNotfEnviado = await EstadoCtrl.buscarEstado(Util.ESTADO_NOTIFICACION_ENVIADO)
                        let estNotfNoEnviado = await EstadoCtrl.buscarEstado(Util.ESTADO_NOTIFICACION_NO_ENVIADO)
                        let usuario = await UsuarioCtrl.findById(agenteNotif.usuario._id)
                        if(tipoNotifApp != null && tipoNotifSMS != null && usuario != null &&
                            estNotfEnviado != null && estNotfNoEnviado != null){
                                let msj = "REPACC: ha sido reportado en un evento de movilidad. Busca con codigo " + 
                                reporte.codigo

                                let notificacionApp = new Notificacion({
                                    reporte: reporte._id,                                
                                    mensaje: msj,
                                    tipo:  tipoNotifApp._id,
                                    usuario: usuario._id,
                                    rol: usuario.rol._id,
                                    estado:  estNotfEnviado    
                                })
                                
                                let objNotifAppSave = await notificacionApp.save()
                            
                                if(objNotifAppSave){
                                    if(agenteNotif.usuario.socketId != null && io != undefined){
                                        try {                                            
                                            console.log("socket de envio: " + agenteNotif.usuario.socketId)                                            
                                            //io.to(agenteNotif.usuario.socketId).emit("notification",objNotifAppSave)
                                            io.emit("notification",objNotifAppSave)                                        
                                        } catch (errore) {
                                            console.log(errore)
                                        }                                    
                                    }else{
                                        console.log("Socket no definido..")
                                    }                                   
                                }else{
                                    console.log("no guardó notif.")
                                }

                                let notificacionSMS = new Notificacion({
                                    reporte: reporte._id,                                
                                    mensaje: msj,
                                    tipo: tipoNotifSMS._id ,
                                    usuario: usuario._id,
                                    rol: usuario.rol._id,
                                    estado: estNotfNoEnviado     
                                })                                                  

                                notificacionSMS.save() 
                        }else{
                            // No se logró registrar la notificacion.                            
                        }
                    }
                                    
                }
            }else{
                // Si no hay agentes, asigna el estado "NO DISPONIBLE"
                let estNoDisp = await EstadoCtrl.buscarEstado(Util.ESTADO_SERVICIO_NODISPONIBLE)

                if(estNoDisp){
                    // cambia el estado del servicio a "NO DISPONIBLE"
                    let serviceUpdate = await Servicio.findByIdAndUpdate(objServicio._id,
                        {
                            estado: estNoDisp._id
                        })

                    objTipo = estNoDisp
                }
            }
        }
    } catch (error) {
        console.log("error en ServicioCtrl.js -> reportarServiciosAgentes()")
        console.log(error)
    }
    

    return objTipo
}

/*************************************************************
 * retorna el agente mas cercano al punto del reporte segun coordenadas gps
 * HAROLDC 31/05/2020
 */
async function obtenerAgenteNotif(reporte, agentesDisp){
    let agenteNotif = null
    let distanciaMenor = 0
    let l_veces = 0
    let distancia = 0
    try {
        agentesDisp.forEach(agente => {
            // Si las coordenadas son validas
            if(agente.latitud != null && agente.longitud != null &&
                reporte.latitud != null && reporte.longitud != null &&
                agente.latitud != 0 && agente.longitud != 0){  
                distancia = Util.calcularDistancia(
                    reporte.latitud,
                    reporte.longitud,
                    agente.latitud,
                    agente.longitud
                )                

                // Si es el primer calculo que realiza
                if(l_veces == 0){
                    l_veces++
                    distanciaMenor = distancia
                    agenteNotif = agente
                }else if(distancia < distanciaMenor){
                    // cuando encuentra una agente con distancia menor a la 
                    // encontrada lo asigna para retornar
                    distanciaMenor = distancia
                    agenteNotif = agente
                }                
            }
        });
    } catch (error) {
        //ignore
    }

    return agenteNotif
}

/***********
 * Consulta los servicios registrado segun id del reporte
 * Si encontro retorna array de objetos de servicios
 * Si no encontro retorna null
 */
async function getServicesByReportId(reportId){
    var servicios = null
    
    try {
        const listaServicios = await Servicio.find({reporte: reportId}, "_id tipo estado").populate([
            {
                path: 'estado'
            },
            {
                path: 'tipo',
                populate: [
                    {
                        path: 'estado'
                    }
                ]
            }
        ])

        if(listaServicios){
            if(listaServicios.length > 0){
                servicios = listaServicios
            }
        }
    } catch (error) {
        // ignore
    }

    return servicios
}

/***********************************************
 * Actualiza el estado del servicio en "AgenRepo" por parte 
 * del agente asignado a este, segun el orden del servicio
 * actualiza en la coleccion "Servicio"
 */
async function actualizarServicio(body){

    let siActualizo = false
    let agenRepo = await buscarAgenRepo(body.servicio._id, body.agente._id)
    
    // Encontro el agenrepo
    if(agenRepo != null){        

        
        agenRepo.detalle.push(body.detalle[body.detalle.length - 1])        
        
        let detalle = agenRepo.detalle                

        let agenRepoUpd = await AgenRepo.findByIdAndUpdate(agenRepo._id,{
            estado: body.estado._id,
            detalle: detalle,
            descripTraslado: body.descriptraslado != null ? body.descriptraslado : null,
            unidadMedica: body.unidadMedica != null ? body.unidadMedica._id : null
        })

        // Si actualizo
        if(agenRepoUpd){
            siActualizo = true

            if( agenRepo.servicio.estado.orden < body.estado.orden){
                // actualiza el estado del servicio
                let servicioUpd = await Servicio.findByIdAndUpdate(agenRepo.servicio._id,
                    {
                        estado: body.estado._id
                    })            
            }

            // Si el estado del servicio fue atendido actualiza el estado del agente
            // cambia a ser ocupado = false
            if(Util.ESTADO_SERVICIO_ATENDIDO === body.estado.codigo){
                body.agente.ocupado = false                
                await AgenteCtrl.updateAgent(body.agente)
            }            
        }   
    }

    return siActualizo
}

/******************************************
 * Busca el AgenRepo segun idServicio y idAgente
 * HAROLD 07/06/2020
 */
async function buscarAgenRepo(servicioId, agenteId){
    let agenRepo = null

    try {
        let agenRepoFinded = await AgenRepo.findOne({
            servicio: servicioId,
            agente: agenteId
        }).populate([
            {
                path: 'servicio',
                populate: [
                    {
                        path: 'estado'
                    }
                ]
            },  
            {
                path: 'estado'
            },
            {
                path: 'tipo',
                populate: [
                    {
                        path: 'estado'
                    }
                ]
            }
        ])

        if(agenRepoFinded){
            agenRepo = agenRepoFinded
        }
    } catch (error) {
        //ignore
    }

    return agenRepo
}

exports.registrarServicios = registrarServicios
exports.getServicesByReportId = getServicesByReportId
exports.reportarServiciosAgentes = reportarServiciosAgentes
exports.actualizarServicio = actualizarServicio