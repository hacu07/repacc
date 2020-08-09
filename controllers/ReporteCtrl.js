const Reporte = require("../models/reporte")
const AgenRepo = require("../models/agenRepo")
const Util = require("../controllers/Util")
const EstadoCtrl = require("../controllers/EstadoCtrl")
const PaisCtrl = require("../controllers/PaisCtrl")
const DepartamentoCtrl = require("../controllers/DepartamentoCtrl")
const MunicipioCtrl = require("../controllers/MunicipioCtrl")
const ServicioCtrl = require("../controllers/ServicioCtrl")
const InvolucradoCtrl = require("../controllers/InvolucradoCtrl")
const AgenteCtrl = require("../controllers/AgenteCtrl")
const AgenRepoCtrl = require("../controllers/AgenRepoCtrl")


/************************************************************
 * Return the latest reports by town.
 * Autor: HAROLDC
 */
async function getBasicInfoReports(idTown, codReporte = null){
    var listReports = null

    const estadoValido = await EstadoCtrl.buscarEstado(Util.ESTADO_REPORTE_VALIDADO)
    const municipio = await MunicipioCtrl.getTownById(idTown)

    let objBusq = 
        codReporte == null ? 
        {municipioReg: idTown, estado : estadoValido._id} : 
        {municipioReg: idTown, codigo : codReporte, estado : estadoValido._id}

    if(municipio != null && estadoValido != null){
        listReports = await Reporte.find(objBusq, "_id imagen direccion date").limit(21).sort({date: -1})
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
            
            // Consulta agente que reportó falsa alarma
            if(reporte.agenteFalAlarm != null){
                reporte.agenteFalAlarm = await AgenteCtrl.findById(reporte.agenteFalAlarm)
            }

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

/************************************************
 * Actualiza estado del reporte notificado por el agente
 * Cuando es falsaAlarma
 * Si no es falsa alarma registra tambien los involucrados 
 * reportados (Coleccion: Involucrados) y genera notificacion
 * a los contactos de emergencia de estos.
 * HAROLDC 02/06/2020
 */
async function actualizarEstado(reporte){
    let siActualizo = false

    try {
        const estadoRepo = await EstadoCtrl.buscarEstado( 
            !reporte.esFalAlarm ? 
            Util.ESTADO_REPORTE_VALIDADO : 
            Util.ESTADO_REPORTE_FALSAALARMA
            )
                
        if(estadoRepo != null){
            const repUpdate = await Reporte.findByIdAndUpdate(reporte._id,
                {
                    agenteFalAlarm: reporte.agenteFalAlarm._id,
                    esFalAlarm: reporte.esFalAlarm,
                    fechaFalAlar: Date.now(),
                    estado: estadoRepo._id
                })
                
            if(repUpdate){
                siActualizo = true

                // si no es falsa alarma reporta a involucrados
                if(!reporte.esFalAlarm){
                    await registrarInvolucrados(reporte._id)
                }else{
                    // Como es falsa alarma cambia el estado de los agentes asociados al reporte
                    await liberarAgentes(reporte)
                }
                
            }
        }
    } catch (error) {
        //ignore        
    }

    return siActualizo
}

/**********************************************+
 * Registra involucrados del reporte y genera notificacion 
 * a los contactos de emergencia
 * HAROLDC 02/06/2020
 */
async function registrarInvolucrados(idReporte){
    const reporte = await findById(idReporte)
    
    if(reporte != null){
        
        if(reporte.placas != null && reporte.placas.length > 0){
            reporte.placas.forEach(placa => {
                InvolucradoCtrl.registrarInvolucrado(idReporte, placa).then().catch()
            });
        }

    }
}

/**********************************************
 * Retorna reportes donde se encuentra registrado del mas reciente al mas antiguo
 * el agente.
 */
async function buscarReporteAgente(_idAgente){
    let agentes = null

    try {
        let reportes = await AgenRepo.find({agente: _idAgente},'servicio').sort({date: -1})
                .populate([
                    {
                        path : 'servicio',
                        select: 'reporte',                                        
                        populate: [
                            {
                                path: 'reporte',                                
                                populate: [
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
                                ]
                            }
                        ]
                    }
                ])        

        if(reportes.length > 0){
            agentes = reportes
        }
    } catch (error) {
        //ignore
    }    

    return agentes
}


/**************************************
 * Cambiar el estado de los agentes una vez se ha validado que el reporte es falsa alarma
 * HAROLDC 05/08/2020
 */
async function liberarAgentes(reporte){        
    const serviciosReporte = await ServicioCtrl.getServicesByReportId(reporte._id)

    // Si el servicio tiene reportes registrados
    if(serviciosReporte != null){

        // Recorre cada servicio y busca los agentes para cambiarles el estado
        for (const posicion in serviciosReporte) {
            const servicio = serviciosReporte[posicion];
            
            // Agentes asociados al servicio del reporte
            const agenRepos = await AgenRepoCtrl.find({servicio: servicio._id})

            // si encontro los agentes asociados al servicio
            if(agenRepos != null){
                
                for (const posAgenRepo in agenRepos) {                                        
                    //  Objeto Agente a actualizar
                    let agente = {
                        _id: agenRepos[posAgenRepo].agente._id,
                        ocupado: false
                    }
                                 
                    let siActualizo = await AgenteCtrl.updateAgent(agente)
                }
            }
        }
    }    
}

exports.registroReporte = registroReporte
exports.getBasicInfoReports = getBasicInfoReports
exports.findById = findById
exports.actualizarEstado = actualizarEstado
exports.registrarInvolucrados = registrarInvolucrados
exports.buscarReporteAgente = buscarReporteAgente