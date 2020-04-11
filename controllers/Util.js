const {check , validationResult} = require('express-validator');

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

exports.validarErrores = validarErrores 
exports.msjError = msjError
exports.msjSuccess = msjSuccess