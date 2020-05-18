const {check , validationResult} = require('express-validator');

/*******************************************************************
 * Funciones utiles a nivel general
 */

 // Constantes usadas a nivel general
 const ESTADO_CODIGO_ACTIVO = "T1A"

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

//funciones
exports.validarErrores = validarErrores 
exports.msjError = msjError
exports.msjSuccess = msjSuccess
exports.generateCode = generateCode
//Constantes
exports.ESTADO_CODIGO_ACTIVO = ESTADO_CODIGO_ACTIVO
exports.ESTADO_REPORTE_ENESPERA = ESTADO_REPORTE_ENESPERA
exports.ESTADO_REPORTE_VALIDADO = ESTADO_REPORTE_VALIDADO
exports.ESTADO_REPORTE_RECHAZADO= ESTADO_REPORTE_RECHAZADO
exports.ESTADO_REPORTE_FALSAALARMA = ESTADO_REPORTE_FALSAALARMA
exports.ESTADO_SERVICIO_ATENDIDO = ESTADO_SERVICIO_ATENDIDO
exports.ESTADO_SERVICIO_ENCAMINO = ESTADO_SERVICIO_ENCAMINO
exports.ESTADO_SERVICIO_NOATENDIDO = ESTADO_SERVICIO_NOATENDIDO
exports.ESTADO_SERVICIO_NODISPONIBLE = ESTADO_SERVICIO_NODISPONIBLE