const VehiculoCtrl = require("../controllers/VehiculoCtrl")
const UsuarioCtrl = require("../controllers/UsuarioCtrl")
const EstadoCtrl = require("../controllers/EstadoCtrl")
const TipoCtrl = require("../controllers/TipoCtrl")
const ContactoCtrl = require("../controllers/ContactoCtrl")
const ReporteCtrl = require("../controllers/ReporteCtrl")
const Util = require("../controllers/Util")
const Involucrado = require("../models/involucrado")
const Notificacion = require("../models/notificacion")
/***************************************
 * Registra las placas, si encuentra que la placa esta asociada a un usuario
 * registra el id del usuario en el objeto Involucrado y genera notificaciones
 * a los contactos de emergencia del usuario
 * HAROLDC 02/06/2020
 */
async function registrarInvolucrado(idReporte, placa){
    // Busca si la placa se encuentra registrada en algun vehiculo
    let vehiculo = await VehiculoCtrl.buscarVehiculoPorPlaca(placa)    

    let involucrado = new Involucrado({
        reporte: idReporte,
        placaqr: placa,
        usuaInvolucrado: (vehiculo != null ? vehiculo.usuario : null)
    })

    try {
        let invSave = await involucrado.save()
        
        // Si registro el involucrado
        if(invSave && vehiculo != null){
            //Busca lista de usuarios a notificar
            let contactos = await ContactoCtrl.buscarContactos(vehiculo.usuario)
            
            // Si encontro contactos de emergencia a notificar
            if(contactos != null && contactos.length > 0 ){

                let tipoNotifApp = await TipoCtrl.buscarTipoSegunCodigo(Util.NOTIFICACION_APP)
                let tipoNotifSMS = await TipoCtrl.buscarTipoSegunCodigo(Util.NOTIFICACION_SMS)
                let estNotfEnviado = await EstadoCtrl.buscarEstado(Util.ESTADO_NOTIFICACION_ENVIADO)
                let estNotfNoEnviado = await EstadoCtrl.buscarEstado(Util.ESTADO_NOTIFICACION_NO_ENVIADO)
                let usuarioInvolucrado = await UsuarioCtrl.findById(vehiculo.usuario._id)
                let reporte = await ReporteCtrl.findById(idReporte)


                if(tipoNotifApp != null && tipoNotifSMS != null && 
                    estNotfEnviado != null && estNotfNoEnviado != null &&
                    usuarioInvolucrado != null && reporte != null){

                        let msj = "REPACC: " + usuarioInvolucrado.nombre.substr(0,30).trim() + 
                                " ha sido reportado en un evento de movilidad. Busca con codigo " + reporte.codigo


                        contactos.forEach(contacto => {
                            // Obtiene info del usuario contacto
                            UsuarioCtrl.findById(contacto.contacto._id)
                                .then( usuarioContacto =>{
                                    if(usuarioContacto != null){
                                        // Registra la notificacion  
                                                                                
                                        let notificacionApp = new Notificacion({
                                            reporte: idReporte,
                                            involucrado: invSave._id,
                                            mensaje: msj,
                                            tipo:  tipoNotifApp._id,
                                            usuario: usuarioContacto._id,
                                            rol: usuarioContacto.rol._id,
                                            estado:  estNotfEnviado    
                                        })      
                                        
                                        notificacionApp.save()

                                        let notificacionSMS = new Notificacion({
                                            reporte: idReporte,
                                            involucrado: invSave._id,
                                            mensaje: msj,
                                            tipo: tipoNotifSMS._id ,
                                            usuario: usuarioContacto._id,
                                            rol: usuarioContacto.rol._id,
                                            estado: estNotfNoEnviado     
                                        })                                                  

                                        notificacionSMS.save()                                                                                                                  
                                    }
                                })
                                .catch()
                        });                           
                }
            }
        }        

    } catch (error) {
        //ignore
    }
}

/*******************************************
 *  Funcion asincrona para registrar las notificaciones
 *  HAROLDC 07/06/2020
 */



exports.registrarInvolucrado = registrarInvolucrado