const express = require('express')
const Util = require('../controllers/Util')
const Vehiculo = require('../models/vehiculo')
const VehiculoCtrl = require('../controllers/VehiculoCtrl')
const router = express.Router()
const { check, validationResult } = require('express-validator')


/*********************************************************
 * 					GET METHOD
************************************************************/
router.get(
	'/buscar/:idUsuario',
	[
		check('idUsuario').isMongoId()
	],
	async (req,res) =>{
		// Valida parametros
		Util.validarErrores(req,res)

		const vehiculos = await VehiculoCtrl.buscarVehiculos(req.params.idUsuario)

		if(vehiculos != null){
			if(vehiculos.length > 0){
				Util.msjSuccess(res,"Vehiculos encontrados.", vehiculos)
			}else{
				Util.msjError(res,"No se encontraron vehiculos registrados.")
			}
		}else{
			Util.msjError(res,"No se logró encontrar vehiculos.")
		}
	}
)


/*********************************************************
 * 				POST METHOD
************************************************************/

/*
	Registra el objeto vehiculo en la BD
*/
router.post(
	'/registro',
	[
		check("usuario._id").isMongoId(),
		check("tipo._id").isMongoId(),
		check("esParticular").isBoolean(),
		check("modelo._id").isMongoId(),
		check("colores").isArray(),
		check("placa").isString().trim().notEmpty()
	],
	async (req,res)=>{
		// Valida Errores en los parametros
		Util.validarErrores(req,res)
		
		const vehiculo = new Vehiculo({
			usuario: req.body.usuario._id,
			tipo: req.body.tipo._id,
			esParticular: req.body.esParticular,
			modelo: req.body.modelo._id,
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