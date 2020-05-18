const Departamento = require("../models/departamento")

/**
 * 
 * @param {*} country Country Object required to find
 * @param {*} stateName Name of state to find
 */
async function getStateByCountryAndName(country, stateName){
    var state = null

    try {
        const stateFind = await Departamento.findOne({pais: country._id, nombre: stateName.toUpperCase()})
        if(stateFind){
            state = stateFind
        }
    } catch (error) {
        //ignore
    }

    return state
}

exports.getStateByCountryAndName = getStateByCountryAndName