const mongoose = require('mongoose')

const municipioSchema = new mongoose.Schema({
    codigo:{
        type: String,
        required: true
    },
    capital:{
        type: Boolean,
        default: false
    },
    nombre: {
        type: String,
        required : true,
        unique: true,
        uppercase: true
    },
    departamento:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'departamento'
    },
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Municipio = mongoose.model('municipio', municipioSchema)

module.exports = Municipio