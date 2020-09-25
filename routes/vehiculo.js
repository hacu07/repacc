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
		const vehiculoSave = await VehiculoCtrl.registrarVehiculo(vehiculo)

		if(vehiculoSave != null){
            Util.msjSuccess(res,"Registro de vehiculo exitoso.", vehiculoSave)
        }else{
            Util.msjError(res,"No se logró registrar el vehiculo.")
        }
	}
)

/*********************************************************
 * 				PUT METHOD
************************************************************/

/*
	Registra el objeto vehiculo en la BD
*/
router.put(
	'/update',
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
			_id : req.body._id,
			usuario: req.body.usuario._id,
			tipo: req.body.tipo._id,
			esParticular: req.body.esParticular,
			modelo: req.body.modelo._id,
			colores: req.body.colores,
			placa: req.body.placa,
			foto: req.body.foto
		})

		const siRegistro = await VehiculoCtrl.actualizarVehiculo(vehiculo)

		if(siRegistro){
            Util.msjSuccess(res,"Actualizacion de vehiculo exitosa.")
        }else{
            Util.msjError(res,"No se logró actualizar el vehiculo.")
        }
	}
)

module.exports = router