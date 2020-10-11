const Notificacion = require("../models/notificacion")
const ServicioCtrl = require("../controllers/ServicioCtrl")
const TipoCtrl = require('../controllers/TipoCtrl')
const Util = require('../controllers/Util')
const AgenteCtrl = require('../controllers/AgenteCtrl')
const NotificationPopulate = require("../populates/notification")
//const EstadoCtrl = require('../controllers/EstadoCtrl')

/******************************************+
 * Realiza busqueda de notificaciones segun objeto "query" 
 */
async function find(query){
    let response = null
    //let estadoFalsaAlarma = await EstadoCtrl.buscarEstado(Util.ESTADO_REPORTE_FALSAALARMA)

    
    try {
        const notifications = await Notificacion.find(query)
        .sort({createdAt: -1})
        .populate(
            NotificationPopulate.NotificationPopulate    
        )
                
        if(notifications.length > 0){
            response = notifications

            //Obtiene servicios de los reportes
            for (let i = 0; i < array.length; i++) {             
                
                let serviciosSolicitados = await ServicioCtrl.getServicesByReportId(notifications[i].reporte._id)
                if(serviciosSolicitados != null){
                    notifications[i].reporte.serviciosSolicitados = serviciosSolicitados
                }
            }        
        }        
    } catch (error) {
        //ignore
    }
    
  
    return response 
}

/******************************************+
 * Realiza busqueda de notificacion segun objeto "query" 
 */
async function findOne(query){
    let response = null  

    try {
        const notification = await Notificacion.findOne(query)        
        .populate(
            NotificationPopulate.NotificationPopulate    
        )
                
        if(notification){
            response = notification 

            //Obtiene servicios del reporte
            let serviciosSolicitados = await ServicioCtrl.getServicesByReportId(response.reporte._id)
            if(serviciosSolicitados != null){
                response.reporte.serviciosSolicitados = serviciosSolicitados
            }
        }        
    } catch (error) {
        //ignore this
    }
      
    return response 
}

async function findUserNotif(body){
    let notifications = null // Todos las notificaciones del usuario
    let notifSinFalsaAlarma = null // solo las notificaciones sin falsa alarma confirmada
    const tipoNotif = await TipoCtrl.buscarTipoSegunCodigo(Util.NOTIFICACION_APP)
    
    if(tipoNotif){        
        let response = await find({usuario: body._id, tipo: tipoNotif._id})        
        if(response != null){
            notifications = response
            

            notifSinFalsaAlarma = await notifications.filter(notificacion => notificacion.reporte.esFalAlarm == false)                        

            for (const notif in notifSinFalsaAlarma) {
                if(notifSinFalsaAlarma[notif].reporte.agenteFalAlarm !== undefined ){
                    notifSinFalsaAlarma[notif].reporte.agenteFalAlarm = await AgenteCtrl.findById(notifSinFalsaAlarma[notif].reporte.agenteFalAlarm)
                }        
            }                        
        }
    }

    return notifSinFalsaAlarma
}

exports.findUserNotif = findUserNotif
exports.find = find
exports.findOne = findOne