const Reporte = require("../models/reporte")
const Util = require("../controllers/Util")
const EstadoCtrl = require("../controllers/EstadoCtrl")
const PaisCtrl = require("../controllers/PaisCtrl")
const DepartamentoCtrl = require("../controllers/DepartamentoCtrl")
const MunicipioCtrl = require("../controllers/MunicipioCtrl")
const ServicioCtrl = require("../controllers/ServicioCtrl")


/************************************************************
 * Return the latest reports by town.
 * Autor: HAROLDC
 */
async function getBasicInfoReports(idTown){
    var listReports = null

    const municipio = await MunicipioCtrl.getTownById(idTown)

    if(municipio != null){
        listReports = await Reporte.find({municipioReg: idTown}, "_id imagen direccion date").limit(21)
    }

    return listReports
}

/************************************************************
 * Return object report find by id
 * Autor: HAROLDC
 */
async function findById(idReporte){
    var reporte = null

    try {
        const objRep = await Reporte.findById(idReporte)
            .populate([
                {
                    path: 'usuarioReg',
                    select: '_id qr correo nombre celular usuario foto rol tipoSangre munNotif munResid estado', 
                    populate: [
                        {
                            path: 'rol',
                            populate:{path: 'estado'}
                        },
                        {
                            path: 'estado'
                        },
                        {
                            path:'munNotif',
                            populate : [
                                {
                                    path: 'departamento',
                                    populate:  [
                                        {                                
                                            path: 'pais',
                                            populate: 'estado'
                                        },
                                        {
                                            path: 'estado'
                                        }
                                    ]
                                },
                                {
                                    path: 'estado'
                                }
                            ]
                        }
                    ]
                },
                {
                    path : 'municipioReg',
                    populate : [
                        {
                            path: 'departamento',
                            populate:  [
                                {                                
                                    path: 'pais',
                                    populate: 'estado'
                                },
                                {
                                    path: 'estado'
                                }
                            ]
                        },
                        {
                            path: 'estado'
                        }
                    ]
                },
                {
                    path: 'estado'
                }
            ])

        if(objRep){
            reporte = objRep 

            // consulta servicios solicitados
            const serviciosSolicitados = await ServicioCtrl.getServicesByReportId(reporte._id)

            if(serviciosSolicitados != null){
                reporte.serviciosSolicitados = serviciosSolicitados
            }
        }
    } catch (error) {
        //ignore
    }

    return reporte
}

/************************************************************
 * Registra el reporte en la BD y retorna codigo en caso de ser exitoso
 * de lo contrario retorna null
 * Autor: HAROLDC
 */
async function registroReporte(body){
    var objReporte = null
    const estado = await EstadoCtrl.buscarEstado(Util.ESTADO_REPORTE_ENESPERA)
    const munReport = await obtMunRep(body.pais,body.departamento,body.municipio)
    if(estado != null && munReport != null){
        var unico = false
        var codigo = ""
        var objRepFind = null
        //Genera codigo unico para el reporte
        while (!unico) {
            codigo = Util.generateCode(6)           
            // Busca si el codigo ya se encuentra registrado
            objRepFind = await Reporte.find({ codigo: codigo})

            //No lo encontro, codigo disponible
            if(objRepFind != null){
                unico = true
                break
            }
        }    

        // El municipio se registra segun el nombre del pais,departamento y ciudad enviados por el cliente
        const reporte = new Reporte({
            codigo: codigo,
            latlong: body.latlong,
            direccion: body.direccion,
            descripcion: body.descripcion,
            estado: estado._id,
            numHeridos: body.numHeridos,
            usuarioReg: body.usuarioReg._id,
            municipioReg: munReport._id,
            placas: body.placas,
            latitud: body.latitud,
            longitud: body.longitud
        })

        try {
            const reportSaved = await reporte.save()
            if(reportSaved){
                objReporte = reportSaved
                // Si se enviaron servicios
                if(body.servicios.length > 0){
                    await ServicioCtrl.registrarServicios(objReporte, body.servicios)
                }
            }
        } catch (error) {
            //ignore
            console.log(error)
        }
    }
    
    return objReporte
}


/*
*   Retorna objeto municipio segun parametros enviados.
*/
async function obtMunRep(nomPais, nomDpto, nomMuni){
    var municipio = null
    // Obtiene objeto Pais segun nombre enviado
    const paisMun = await PaisCtrl.getCountryByName(nomPais)
    if(paisMun != null){
        // obtiene objetoDpto segun ObjetoPais y nombre Dpto enviados
        const dptoMun = await DepartamentoCtrl.getStateByCountryAndName(paisMun,nomDpto)
        if(dptoMun){
            // obtiene objetoMunicipio segun objetoDpto y nombreMunicipio enviados
            const munFind = await MunicipioCtrl.getTownByStateAndName(dptoMun, nomMuni)
            if(munFind){
                // Retorna objetoMunicipio
                municipio = munFind
            }
        }
    }
    return municipio
}



exports.registroReporte = registroReporte
exports.getBasicInfoReports = getBasicInfoReports
exports.findById = findById