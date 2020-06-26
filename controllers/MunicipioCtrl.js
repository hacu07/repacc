const Municipio = require("../models/municipio")

/******************************************************
 * Return 'Municipio' object by _id
 */
async function getTownById(idTown){
    var town = null

    try {
        const townFind = await Municipio.findOne({_id: idTown})
            .populate([
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
            ])

        if(townFind){
            town = townFind
        }
    } catch (error) {
        //ignore
    }

    return town
}

/******************************************************
 * Return 'Municipio' object by state and town Name
 */
async function getTownByStateAndName(state, townName){
    var town = null

    try {
        const townFind = await Municipio.findOne({departamento: state._id, nombre: townName.toUpperCase()})
            .populate([
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
                }
            ])

        if(townFind){
            town = townFind
        }
    } catch (error) {
        //ignore
    }

    return town
}

exports.getTownByStateAndName = getTownByStateAndName
exports.getTownById = getTownById