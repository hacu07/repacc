const mongoose = require('mongoose')

const agenteSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    // Si se encuentra asignado a algun reporte
    ocupado:{
        type: Boolean,
        default: false
    },
    // Si se encuentra disponible o no
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
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
    usuaReg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    // Ubicacion actual del agente cuando su estado es "ACTIVO"
    latitud: Number,
    longitud: Number,
    // Codigo del servicio que presta el agente
    servicio:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Agente = mongoose.model("agente", agenteSchema)

module.exports = Agente