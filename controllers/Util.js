const {check , validationResult} = require('express-validator');

/*******************************************************************
 * Funciones utiles a nivel general
 */

 // Constantes usadas a nivel general
 const ESTADO_CODIGO_ACTIVO = "T1A"
 const ESTADO_CODIGO_INACTIVO = "T1I"
 const ESTADO_CODIGO_OCUPADO = "T1O"

 // codigos de estado de los reportes
 const ESTADO_REPORTE_ENESPERA      = "T3E"
 const ESTADO_REPORTE_VALIDADO      = "T3V"
 const ESTADO_REPORTE_FALSAALARMA   = "T3F"
 const ESTADO_REPORTE_RECHAZADO     = "T3R"
 // codigos de estado de los servicios
 const ESTADO_SERVICIO_NOATENDIDO   = "T4NA"
 const ESTADO_SERVICIO_ENCAMINO     = "T4EC"
 const ESTADO_SERVICIO_ATENDIDO     = "T4A"
 const ESTADO_SERVICIO_NODISPONIBLE = "T4ND"
 // Servicios
 const SERVICIO_AMBULANCIA = "TSA"
 const SERVICIO_AGENTE_TRANSITO = "TSAT"
 const SERVICIO_BOMBEROS = "TSB"
 const SERVICIO_GRUA = "TSG"

 //Tipo de Notificacion al reportar a contactos de emergencia
 const NOTIFICACION_APP = "NTFA"
 const NOTIFICACION_SMS = "NTFS"

 // Codigos de tipo de las entidades
 const TIPO_ENTIDAD_SALUD = "ENTS"

 // Estado de notificacion a contacto de emergencia
 const ESTADO_NOTIFICACION_NO_ENVIADO = "T5NE"
 const ESTADO_NOTIFICACION_ENVIADO = "T5E"
 

 
/*******************************************************************
 * Funciones utiles a nivel general
 */

 /**
  * Valida si ocurrio error al evaluar los parametros enviados
  * @param req contiene los parametros enviados a evaluar en la solicitud a la API
  */
function validarErrores(req, res){
    // Si ocurrio un error en validación de parametros
    const errors = validationResult(req);

    if(!errors.isEmpty()){ // encontró errores
        console.log(errors.array())
        return res.json(
            {                
                error: true,
                msj: "Error en datos enviados.",
                errors: errors.array()
            }
        );
    }
}

/**
 * Retorna en Formato JSON mensaje de ejecucion exitosa
 * @param {*} res Objeto para responder el msj en fto JSON
 * @param {*} msjOk Mensaje a retornar en el JSON
 */
function msjSuccess(res, msjOk, contenido = null){
    return res.json(
        {                
            error: false,
            msj: msjOk,
            content: contenido
        }
    );
}

/**
 * Retorna en Formato JSON mensaje de error
 * @param {*} res Objeto para responder el msj en fto JSON
 * @param {*} msjErr Mensaje a retornar en el JSON
 */
function msjError(res, msjErr){
    return res.json(
        {                
            error: true,
            msj: msjErr
        }
    );
}

/**
 *  Genera un numero entero aleatorio segun la longitud indicada
 * @param {*} length Longitud del codigo a generar
 */
function generateCode(length){
    return Math.floor(Math.random() * Math.pow(10,length))
}


/**********************************************
 * Calcula la distancia a km entre dos latitudes y longitudes
 * tomado de: https://www.movable-type.co.uk/scripts/latlong.html
 */
function calcularDistancia(lat1, lon1, lat2, lon2){
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c;

    const km = (d / 1000).toFixed(3)

    return km
}

//funciones
exports.validarErrores = validarErrores 
exports.msjError = msjError
exports.msjSuccess = msjSuccess
exports.generateCode = generateCode
exports.calcularDistancia = calcularDistancia
//Constantes
exports.ESTADO_CODIGO_ACTIVO = ESTADO_CODIGO_ACTIVO
exports.ESTADO_CODIGO_INACTIVO = ESTADO_CODIGO_INACTIVO
exports.ESTADO_CODIGO_OCUPADO = ESTADO_CODIGO_OCUPADO

exports.ESTADO_REPORTE_ENESPERA = ESTADO_REPORTE_ENESPERA
exports.ESTADO_REPORTE_VALIDADO = ESTADO_REPORTE_VALIDADO
exports.ESTADO_REPORTE_RECHAZADO= ESTADO_REPORTE_RECHAZADO
exports.ESTADO_REPORTE_FALSAALARMA = ESTADO_REPORTE_FALSAALARMA

exports.ESTADO_SERVICIO_ATENDIDO = ESTADO_SERVICIO_ATENDIDO
exports.ESTADO_SERVICIO_ENCAMINO = ESTADO_SERVICIO_ENCAMINO
exports.ESTADO_SERVICIO_NOATENDIDO = ESTADO_SERVICIO_NOATENDIDO
exports.ESTADO_SERVICIO_NODISPONIBLE = ESTADO_SERVICIO_NODISPONIBLE

exports.SERVICIO_AMBULANCIA = SERVICIO_AMBULANCIA
exports.SERVICIO_AGENTE_TRANSITO = SERVICIO_AGENTE_TRANSITO
exports.SERVICIO_BOMBEROS = SERVICIO_BOMBEROS
exports.SERVICIO_GRUA = SERVICIO_GRUA

exports.NOTIFICACION_APP = NOTIFICACION_APP
exports.NOTIFICACION_SMS = NOTIFICACION_SMS

exports.ESTADO_NOTIFICACION_NO_ENVIADO = ESTADO_NOTIFICACION_NO_ENVIADO
exports.ESTADO_NOTIFICACION_ENVIADO = ESTADO_NOTIFICACION_ENVIADO

exports.TIPO_ENTIDAD_SALUD = TIPO_ENTIDAD_SALUD