const express = require('express')
const Util = require('../controllers/Util')
const NotificacionCtrl = require('../controllers/NotificacionCtrl')

// toma la ruta donde se encuentra alojado el archivo y 
// todos los paths que apunten a este se ejecutan aca
const router = express.Router()
const { check, validationResult } = require('express-validator');



 /*****************************************************************************
 *                      METHOD GET
 *********************************************************************** */
router.get(
    '/:_id',
    [
        check('_id').isMongoId()
    ],
    async (req,res)=>{
        Util.validarErrores(req,res)
        
        const notifications = await NotificacionCtrl.findUserNotif(req.params)

        if(notifications != null){
            Util.msjSuccess(res,'Notificaciones encontradas.',notifications)
        }else{
            Util.msjError(res,'No se logró encontrar notificaciones.')
        }

    }
)
 
 /*****************************************************************************
 *                      METHOD POST
 *********************************************************************** */

 
 /*****************************************************************************
 *                      METHOD PUT
 *********************************************************************** */


 /*****************************************************************************
 *                      METHOD DELETE
 *********************************************************************** */


module.exports = router