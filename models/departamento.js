const mongoose = require('mongoose')

const departamentoSchema = new mongoose.Schema({
    codigo:{
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required : true,
        uppercase: true
    },
    pais:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pais'
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

const Departamento = mongoose.model('departamento', departamentoSchema)

module.exports = Departamento