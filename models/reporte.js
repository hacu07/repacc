const mongoose = require("mongoose")

const reporteSchema = new mongoose.Schema({
    codigo:{
        type: String,
        unique: true,
        required: true
    },
    placas:{
        type: Array,
        required: true
    },
    latlong:{
        type: String,
        required: true
    },
    latitud: Number,
    longitud: Number,
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
    esFalAlarm: {
        type: Boolean,
        default: false
    },
    // Agente que reporto falsa alarma
    agenteFalAlarm:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agente'
    },
    // Fecha de reporte de falsa alarma
    fechaFalAlar:Date,
    date:{
        type: Date,
        default: Date.now
    },
    serviciosSolicitados: []
})

const Reporte = mongoose.model("reporte", reporteSchema)

module.exports = Reporte