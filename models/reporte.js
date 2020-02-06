const mongoose = require("mongoose")

const reporteSchema = new mongoose.Schema({
    codigo:{
        type: String,
        unique: true,
        required: true
    }, 
    latitud: {
        type: String,
        required: true
    },
    longitud: {
        type: String,
        required: true
    },
    direccion:String,
    descripcion:{
        type: String,
        required: true
    },
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        required: true
    },
    imagen: String,
    imgValid:{
        type: Boolean,
        default: false
    },
    numHeridos:{
        type: Number,
        default: 0
    },
    usuarioReg:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    municipioReg:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipio',
        required: true
    },
    // Agente que reporto false alarma
    agenteFalAlar:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agente'
    },
    fechaFalAlar:Date,
    date:{
        type: Date,
        default: Date.now
    }
})

const Reporte = mongoose.model("reporte", reporteSchema)

module.exports = Reporte