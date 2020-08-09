const Util = require("./Util.js")
const AgenRepo = require("../models/agenRepo")
const POPULATEAGENREPO = [
    // SERVICIO
    {
        path: 'servicio',
        populate: [   
            // No se carga el reporte.     
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
        ]
    },
    // AGENTE
    {
        path: 'agente',
        select: '_id estado municipio ocupado entidad usuario latitud longitud servicio',
        populate: [
            {
                path: 'estado'
            },
            {
                path: 'municipio',
                populate: [
                    {
                        path: 'departamento',
                        populate: [
                            {
                                path: 'pais',
                                populate: {path: 'estado'}
                            },
                            {
                                path: 'estado'
                            }
                        ]
                    },
                    {
                        path : 'estado'
                    }
                ]
            },
            {
                path: 'entidad',
                select: '_id nit nombre direccion municipio latlong latitud longitud estado tipo',
                populate: [
                    {
                        path:'municipio',
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
                    },
                    {
                        path: 'tipo',
                        populate: [
                            {
                                path: 'estado'
                            }
                        ]
                    }
                ]
            },
            {
                path: 'usuario',
                select: '-contrasena',
                populate : [
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
            }
        ]
    },
    {
        path: 'estado'
    },
    {
        path: 'entidad',
        select: '_id nit nombre direccion municipio latlong latitud longitud estado tipo',
        populate: [
            {
                path:'municipio',
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
            },
            {
                path: 'tipo',
                populate: [
                    {
                        path: 'estado'
                    }
                ]
            }
        ]
    }
]

/********************
 * Busca agentes segun servicio
 */
async function find(query){
    let response = null

    try {
        // OJOOOOOOOO FALTA POBLAR LAS OTRAS COSAS
        // cuando se poble ver liberarAgentes() en ReporteCtrl.js para modificar.
        let res = await AgenRepo.find(query).populate(POPULATEAGENREPO)

        if(res != null && res.length > 0){
            response = res
        }
    } catch (error) {
        //ignore error
    }

    return response 
}

exports.find = find