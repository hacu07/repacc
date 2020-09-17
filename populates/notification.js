exports.NotificationPopulate = [
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