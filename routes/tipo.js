const express = require('express')
const Util = require('../controllers/Util')
const TipoCtrl = require('../controllers/TipoCtrl')
const router = express.Router()
const { check, validationResult } = require('express-validator');

/********************************************
 *          GET METHOD
 */
router.get(
    '/buscar/:tipo',
    [
        check('tipo').isNumeric()
    ],
    async (req,res) =>{

        // Valida parametros
        Util.validarErrores(req,res)

        //  Busca tipo
        const tipos = await TipoCtrl.buscarTipo(req.params.tipo)

        if(tipos != null){
            if(tipos.length != 0){
                Util.msjSuccess(res, "Tipo encontrado.", tipos)
            }else{
                Util.msjError(res,"No se encontraron registros del tipo.")
            }
        }else{
            Util.msjError(res,"No se logró obtener tipo.")
        }
    }
)




 /********************************************
 *          POST METHOD
 */
router.post(
    '/registro/',
    [
        check('tipo').isNumeric().notEmpty(),
        check('nombre').isString().notEmpty(),
        check('descripcion').isString().notEmpty(),
        check('codigo').isString().notEmpty()
    ],
    async (req,res)=>{
        // Validacion de parametros
        Util.validarErrores(req,res)

        const siRegistro = await TipoCtrl.registrarTipo(req.body.tipo, req.body.codigo, req.body.nombre, req.body.descripcion)

        if(siRegistro){
            Util.msjSuccess(res,"Registro de tipo exitoso.")
        }else{
            Util.msjError(res,"No se logró registrar el tipo.")
        }
    }
)

module.exports = router