const mongoose  = require('mongoose')

const contactoSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    contacto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Contacto = mongoose.model('contacto', contactoSchema)

module.exports = Contacto