const express = require('express')
const Util = require('../controllers/Util')
const ModeloCtrl = require('../controllers/ModeloCtrl')
const router = express.Router()
const { check, validationResult } = require('express-validator');


/*********************************************************
 * 					GET METHOD
************************************************************/
router.get(
	'/buscar/:idMarca',
	[
		check('idMarca').isMongoId()
	],
	async (req,res) =>{
		// Valida parametros
		Util.validarErrores(req,res)

		const modelos = await ModeloCtrl.obtenerModelos(req.params.idMarca)

		if(modelos != null){
			if(modelos.length > 0){
				Util.msjSuccess(res,"Modelos encontrados.", modelos)
			}else{
				Util.msjError(res,"No se encontraron modelos registrados.")
			}
		}else{
			Util.msjError(res,"No se logró encontrar modelos.")
		}
	}
)

/****************************************************
 *      POST METHOD
 */
router.post(
    '/registro/',
    [
        check('nombre').isString().notEmpty(),
        check('marca').isMongoId()
    ],
    async (req,res)=>{
        // Valida Errores en los parametros
        Util.validarErrores(req,res)

        const siRegistro = await ModeloCtrl.registrarModelo(req.body.nombre, req.body.marca)

        if(siRegistro){
            Util.msjSuccess(res,"Registro de modelo exitoso.")
        }else{
            Util.msjError(res,"No se logró registrar el modelo.")
        }
        
    })

module.exports = router