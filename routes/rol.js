const express = require("express")
const Rol = require("../models/rol")
const Estado = require("../models/estado")

// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');


/*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */


 /*********************************************
 * Retorna los roles registrados
 */
router.get('/', async (req,res)=>{
    const roles = await Rol.find(null,'nombre estado tipo')
                            .populate('estado', 'nombre')
                            .setOptions({sort:{tipo:1, nombre:1}})
                            

    // Encontro resultados
    if(roles.length > 0){
        res.json({
            error: false,
            content: roles
        })
    }else{ // No encontro resultados
        res.json({
            error: true,
            msj: "No se encontraron registros."
        })
    }
    
})


/********************************************
 * Retorna estados segun tipo indicado
 */
router.get('/:tipo', [check('tipo').isNumeric()] ,async (req,res)=>{
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

    // Consulta los estados segun el tipo enviado por parametro
    const roles = await Rol.find({tipo: req.params.tipo},'nombre estado tipo')
                            .populate('estado', 'nombre')
                            .setOptions({sort:{tipo:1, nombre:1}})

    // Si encontro resultados
    if(roles.length > 0){
        res.json({
            error: false,
            content: roles
        })
    }else{ // No encontro resultados
        res.json({
            error: true,
            msj: "No se encontraron registros."
        })
    }
    
    
})

/*****************************************************************************
 *                      METHOD POST
 ************************************************************************/

/*******************************************
 * Registra estado
 * NOTA: FALTA AGREGAR MIDDLEWARE DE VALIDACION DE REGISTRO SEGUN USUARIO-PERMISO
 */
router.post('/',
    [check('nombre').isString(),
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

    // Asigna estado 'ACTIVO' por defecto
    Estado.findOne({tipo: 1, nombre:"ACTIVO"}, async function(err,objEstado){
        // Ocurrio error al buscar
        if(err){
            return res.json({
                error: true,
                msj: 'Error al obtener estado ha asignar al rol'
            })
        }

        // No ocurrio error al buscar el estado a asignar por defecto...
        if(objEstado){
            const objRol = new Rol({
                nombre: req.body.nombre,
                tipo: req.body.tipo,
                estado: objEstado._id
            })

            // Guarda en BD
            try {
                const objRolSave = await objRol.save()

                if(objRolSave){
                    res.json({
                        error: false,
                        content: objRolSave
                    }) 
                }else{
                    res.json({
                        error: true,
                        msj: "No se logró almacenar el rol. Intente de nuevo."
                    })
                }
                

            } catch (error) {
                // Error al guardar Rol
                res.json({
                    error: true,
                    msj: 'No se logró almacenar el rol'
                })
            }
        }else{ // No encontro estado "ACTIVO"
            res.json({
                error: true,
                msj: 'No se logró obtener estado ha asignar al rol'
            })
        }

    });
    
})
/*****************************************************************************
 *                      METHOD PUT
 *********************************************************************** */
router.put('/:id',
    // Validacion de parametros
    [
    check('id').isMongoId(),
    check('nombre').isString(), 
    check('idEstado').isMongoId(), 
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
        //No encontró errores en los parametros
    
        //  Documentacion https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        //  Valida si existe el rol con el id enviado por parametros
        //  y actualiza si lo encuentra
        try {
            const rolAct = await Rol.findByIdAndUpdate( req.params.id,{
                // campos a actualizar
                nombre: req.body.nombre.trim(),
                tipo: req.body.tipo,
                estado: req.body.idEstado
            },{
                // Devuelve el documento con datos modificados
                new: true
            })
    
            // Si no encontro el estado por el id en la BD
            if(!rolAct){
                return res.status(404).json({
                    error: true,
                    msj: "No se logro actualizar el rol."
                })
            }
    
            // Actualizó de manera correcta.
            res.json({
                error: false,
                content: rolAct
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
router.delete('/:id',[check('id').isMongoId()] , async (req,res)=>{
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
    //No encontró errores en los parametros

    // valida si existe en la bd y elimina el estado
    const rol = await Rol.findByIdAndDelete(req.params.id)

    // No encontro el estado en la bd
    if(!rol){
        return res.status(404).json({
            error: true,
            msj: "No se encontro rol."            
        })
    }

    res.status(200).json({
        error: false,
        msj: "Estado borrado correctamente.",
        content: rol
    })
})


module.exports = router