const Pais = require("../models/pais")


async function getCountryByName(countryName){
    var objCountry = null
    try {
        const country = await Pais.findOne({nombre : countryName.toUpperCase()})
        if(country){
            objCountry = country
        }
    } catch (error) {
        //ignore
    }
    return objCountry
}

exports.getCountryByName = getCountryByName