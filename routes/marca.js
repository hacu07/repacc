const express = require('express')
const Util = require('../controllers/Util')
const MarcaCtrl = require('../controllers/MarcaCtrl')
const EstadoCtrl = require('../controllers/EstadoCtrl')
const router = express.Router()
const { check, validationResult } = require('express-validator');

router.post(
    "/registro/",
    [
        check("nombre").isString().notEmpty(),
    ],
    async (req, res) => {
        // Valida Errores en los parametros
        Util.validarErrores(req,res)

        // Obtiene Estado Activo
        const estT2A = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_ACTIVO)

        if(estT2A != null){
            // Realiza registro
            const marca = await MarcaCtrl.registrarMarca(req.body.nombre, estT2A)

            if(marca){
                Util.msjSuccess(res, "Marca registrada correctamente.")
            }else{
                Util.msjError(res, "No se logró registrar la marca.")
            }
        }else{
            // No encontro estado activo
            Util.msjError(res,"No se logró registrar el estado. Contacte a soporte.")
        }
    }
)

module.exports = router