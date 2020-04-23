const express = require('express')
const Util = require('../controllers/Util')
const Vehiculo = require('../models/vehiculo')
const VehiculoCtrl = require('../controllers/VehiculoCtrl')
const router = express.Router()
const { check, validationResult } = require('express-validator');



/*********************************************************
 * 				POST METHOD
************************************************************/

/*
	Registra el objeto vehiculo en la BD
*/
router.post(
	'/registro',
	[
		check("usuario").isMongoId(),
		check("tipo").isMongoId(),
		check("esParticular").isBoolean(),
		check("modelo").isMongoId(),
		check("colores").isArray(),
		check("placa").isString().trim().notEmpty()
	],
	async (req,res)=>{
		// Valida Errores en los parametros
		Util.validarErrores(req,res)
		
		const vehiculo = new Vehiculo({
			usuario: req.body.usuario,
			tipo: req.body.tipo,
			esParticular: req.body.esParticular,
			modelo: req.body.modelo,
			colores: req.body.colores,
			placa: req.body.placa
		})
		const siRegistro = await VehiculoCtrl.registrarVehiculo(vehiculo)

		if(siRegistro){
            Util.msjSuccess(res,"Registro de vehiculo exitoso.")
        }else{
            Util.msjError(res,"No se logró registrar el vehiculo.")
        }
	}
)

module.exports = router