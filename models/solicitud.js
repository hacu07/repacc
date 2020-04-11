const mongoose = require('mongoose')

const solicitudSchema = new mongoose.Schema({
    // Usuario que envia la solicitud
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'usuario',
        required: true
    },
    // Usuario que recibe la solicitud
    contacto:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'usuario',
        required: true
    },
    estado:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'estado',
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Solicitud = mongoose.model('solicitud',solicitudSchema)

module.exports = Solicitud