const mongoose = require("mongoose")

const rolSchema = new mongoose.Schema({
    nombre:{
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

const Rol = mongoose.model('rol', rolSchema)

module.exports = Rol
