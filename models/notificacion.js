const mongoose = require("mongoose")

const notificacionSchema = new mongoose.Schema({
    reporte:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reporte',
        required: true
    },
    // Se establece cuando se envia al contacto del involucrado
    involucrado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'modelo'
        // No es requerido siempre el involucrado ya que se puede enviar solo la notifacion del reporte en general.
    },
    mensaje:{
        type: String,
        required: true
    },
    // Si es de tipo SMS, Notificación, etc.
    tipo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo',
        required: true
    },
    // usuario al que se le envia el mensaje
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    // rol del usuario al que se le envio el mensaje [para reportes]
    rol:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rol',
        required: true
    },
    // Estado de la notificacion [enviado, por enviar, no enviado, etc.]
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        required: true
    }
}
,
{
    timestamps: true
})

const Notificacion = mongoose.model("notificacion",notificacionSchema)

module.exports = Notificacion