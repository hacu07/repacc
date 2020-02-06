const mongoose = require('mongoose')

const municipioSchema = new mongoose.Schema({
    codigo:{
        type: Number,
        required: true
    },
    capital:{
        type: Boolean,
        default: false
    },
    nombre: {
        type: String,
        required : true
    },
    departamento:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'departamento'
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

const Municipio = mongoose.model('municipio', municipioSchema)

module.exports = Municipio