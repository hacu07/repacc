const Entidad = require("../models/entidad")
const EstadoCtrl = require("./EstadoCtrl")
const Util =  require("./Util")
const MunicipioCtrl = require("./MunicipioCtrl")
const TipoCtrl = require("./TipoCtrl")

/***************************************
 * Busca la entidad segun id
 */
async function findById(idEntidad){
    let entidad = null

    try {
        const objEntidad = await Entidad.findById(idEntidad, "_id nit nombre direccion municipio " + 
        "latlong latitud longitud estado tipo")        

        if(objEntidad){
            objEntidad.municipio = await MunicipioCtrl.getTownById(objEntidad.municipio)
            objEntidad.estado = await EstadoCtrl.findById(objEntidad.estado)
            objEntidad.tipo = await TipoCtrl.findById(objEntidad.tipo)

            entidad = objEntidad
        }
    } catch (error) {
        // ignore
    }

    return entidad
}

/*********************************
 * Registra la entidad
 * Retorna null si no logra registrarla
 * de lo contrario retorna el objeto registrado
 * HAROLDC 25/05/2020
 */
async function save(body){
    let entidad = null

    try{
        let estadoDisp = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_ACTIVO)

        if(estadoDisp){
            const objEntidad = new Entidad({
                nit: body.nit,
                nombre: body.nombre,
                direccion: body.direccion,
                municipio: body.municipio._id,
                latlong: body.latlong,
                latitud: body.latitud,
                longitud: body.longitud,
                estado: estadoDisp._id,
                usuario: body.usuario._id,
                tipo: body.tipo._id
            })

            const entidadSaved = await objEntidad.save()

            if(entidadSaved){
                entidad = entidadSaved
            }
        }
    }catch(error){
        // ignore
        console.log(error)
    }

    return entidad
}

exports.save = save
exports.findById = findById