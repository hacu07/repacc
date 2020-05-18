const Servicio = require("../models/servicio")
const EstadoCtrl = require("../controllers/EstadoCtrl")
const Util = require("../controllers/Util")

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
                
                }
            } catch (error) {
                //ignore
            }
        });
    }
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

exports.registrarServicios = registrarServicios
exports.getServicesByReportId = getServicesByReportId