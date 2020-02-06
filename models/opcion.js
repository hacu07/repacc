const mongoose = require("mongoose")

const opcionSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    descripcion:{
        type: String, 
        required: true
    },
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado'
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Opcion = mongoose.model('opcion', opcionSchema)

module.exports = Opcion