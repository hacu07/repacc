const mongoose = require('mongoose')

const tipoSchema = new mongoose.Schema({
    tipo:{
        type: Number,
        required : true
    },
    codigo:{
        type: String, 
        required: true,
        unique: true
    },
    nombre:{
        type: String,
        required : true
    },
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado'
    },
    descripcion:{
        type: String,
        required : true
    },
    date:{
        type: Date,
        default: Date.now
    } 
})

const Tipo = mongoose.model('tipo', tipoSchema)

module.exports = Tipo