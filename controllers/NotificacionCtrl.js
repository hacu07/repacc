const Notificacion = require("../models/notificacion")
const TipoCtrl = require('../controllers/TipoCtrl')
const Util = require('../controllers/Util')
const AgenteCtrl = require('../controllers/AgenteCtrl')

async function find(query){
    let response = null
    
    try {
        const notifications = await Notificacion.find(query)
        .sort({createdAt: -1})
        .populate(
            [
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
                },
                {
                    path: 'involucrado',
                    select: 'tipo placaqr usuaInvolucrado',
                    populate : ([
                        {
                            path: 'tipo'
                        },
                        {
                            path: 'usuaInvolucrado',
                            select : '_id codRecuCon recibirNotif qr correo nombre celular usuario rol estado foto',
                            populate: (
                                [
                                    {
                                        path: 'rol',
                                        populate:{path: 'estado'}
                                    },
                                    {
                                        path: 'estado'
                                    }
                                ]
                            )
                        }
                    ])
                },
                {
                    path: 'tipo'
                },
                {
                    path: 'usuario',
                    select : '_id codRecuCon recibirNotif qr correo nombre celular usuario rol estado foto',
                    populate: (
                        [
                            {
                                path: 'rol',
                                populate:{path: 'estado'}
                            },
                            {
                                path: 'estado'
                            }
                        ]
                    )
                },
                {
                    path: 'rol',
                    populate:{path: 'estado'}
                }
            ]
        )      
        if(notifications.length > 0){
            response = notifications   
        }        
    } catch (error) {
        //ignore
    }
    return response 
}

async function findUserNotif(body){
    let notifications = null
    const tipoNotif = await TipoCtrl.buscarTipoSegunCodigo(Util.NOTIFICACION_APP)
    
    if(tipoNotif){        
        let response = await find({usuario: body._id, tipo: tipoNotif._id})        
        if(response != null){
            notifications = response            

            for (const notif in notifications) {                
                if(notifications[notif].reporte.agenteFalAlarm !== undefined){
                    notifications[notif].reporte.agenteFalAlarm = await AgenteCtrl.findById(notifications[notif].reporte.agenteFalAlarm)
                }
            }            
        }
    }

    return notifications
}

exports.findUserNotif = findUserNotif