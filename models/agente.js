const mongoose = require('mongoose')

const agenteSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    // Si se encuentra disponible o no
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estadp',
        required: true
    },
    // municipio donde el agente presta el servicio
    municipio:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipio',
        required: true
    },
    // entidad en la que labora el agente
    entidad:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'entidad',
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Agente = mongoose.model("agente", agenteSchema)

module.exports = Agente