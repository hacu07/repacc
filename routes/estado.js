const express = require("express")
const Estado = require("../models/estado")

// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');


/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */


 /*********************************************
 * Retorna los estados registrados
 */
router.get('/', async (req,res)=>{
    const estados = await Estado.find(null,'nombre tipo descripcion')
    res.send(estados)
})


/********************************************
 * Retorna estados segun tipo indicado
 */
router.get('/:tipo', async (req,res)=>{
    // Consulta los estados segun el tipo enviado por parametro
    Estado.find({tipo: req.params.tipo},'nombre tipo descripcion', (err,docs)=>{
        // callback 
        if(err) return res.send(err)

        if(docs.length == 0){ // No encontro resultados
            return res.status(404).json(
                {                
                    error: true,
                    msj: "No se encontraron resultados"
                }
            );
        }
        // Si encontro los estados por el tipo
        res.json({
            error: false,              
            content: docs
        })
    })
})

/*****************************************************************************
 *                      METHOD POST
 ************************************************************************/

/*******************************************
 * Registra estado
 * NOTA: FALTA AGREGAR MIDDLEWARE DE VALIDACION DE REGISTRO SEGUN USUARIO-PERMISO
 */
router.post('/',
    [check('codigo').isString().notEmpty(),
    check('nombre').isString(), 
    check('descripcion').isString(), 
    check('tipo').isNumeric()],
    async (req,res)=>{

    // Si ocurrio un error en validación de parametros
    const errors = validationResult(req);

    if(!errors.isEmpty()){ // encontró errores
        return res.status(422).json(
            {                
                error: true,
                msj: "Error en datos enviados.",
                errors: errors.array()
            }
        );
    }
    //No encontro errores en los parametros

    // Objeto con datos tomados de los parametros enviados por el cliente
    const objEstado = new Estado({
        codigo: req.body.codigo.trim(),
        nombre: req.body.nombre.trim(),
        tipo: req.body.tipo,
        descripcion: req.body.descripcion.trim()
    })
    // guarda en la bd 
    try {
        const result = await objEstado.save()  
        res.status(201).json({
            error: false,
            content: result
        })
    } catch (error) {
        // El nombre del estado es unico [No debe existir otro en la BD]
        return res.status(422).json(
            {                
                error: true,
                msj: "No se logro registrar el estado."        
            }
        );
    }
    })
/*****************************************************************************
 *                      METHOD PUT
 *********************************************************************** */
router.put('/:id',
    // Validacion de parametros
    [check('nombre').isString(), 
    check('descripcion').isString(), 
    check('tipo').isNumeric()], async (req,res)=>{

        // Si ocurrio un error en validación de parametros
        const errors = validationResult(req);

        if(!errors.isEmpty()){ // encontró errores
            return res.status(422).json(
                {                
                    error: true,
                    msj: "Error en datos enviados.",
                    errors: errors.array()
                }
            );
        }
        //No encontro errores en los parametros
    
        //  Documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        //  Valida si existe el estado con el id enviado por parametros
        //  y actualiza si lo encuentra
        try {
            const estadoAct = await Estado.findByIdAndUpdate( req.params.id,{
                // campos a actualizar
                nombre: req.body.nombre.trim(),
                tipo: req.body.tipo,
                descripcion: req.body.descripcion.trim()
            },{
                // Devuelve el documento con datos modificados
                new: true
            })
    
            // Si no encontro el estado por el id en la BD
            if(!estadoAct){
                return res.status(404).json({
                    error: true,
                    msj: "No se logro actualizar el estado."
                })
            }
    
            // Actualizo de manera correcta.
            res.json({
                error: false,
                content: estadoAct
            })
        } catch (error) {
            res.json({
                error: false,
                msj : "Ha ocurrido un error al registrar el estado, por favor intente de nuevo."
            })
        }

        

    })

/*****************************************************************************
 *                      METHOD DELETE
 *********************************************************************** */
router.delete('/:id', async (req,res)=>{
    // valida si existe en la bd y elimina el estado
    const estado = await Estado.findByIdAndDelete(req.params.id)

    // No encontro el estado en la bd
    if(!estado){
        return res.status(404).json({
            error: true,
            msj: "No se encontro estado."
        })
    }

    res.status(200).json({
        error: false,
        msj: "Estado borrado correctamente."
    })
})


module.exports = router