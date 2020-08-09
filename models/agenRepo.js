//Agentes que atienden el llamado en los reportes
const mongoose = require("mongoose")

//subdomento de detalle
const detalle = new mongoose.Schema({
    estado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado', 
        required: true
    },
    latitud: {
        type: Number,
        default: 0
    },
    longitud: {
        type: Number,
        default: 0
    },
    date: {
        type:Date,
        default: Date.now
    }
})

const agenRepoSchema = new mongoose.Schema({
    servicio:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'servicio',
        required: true
    },
    agente:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'agente',
        required: true
    },
    // https://stackoverflow.com/questions/19695058/how-to-define-object-in-array-in-mongoose-schema-correctly-with-2d-geo-index
    // documentacion para insertar el detalle
    detalle:[detalle],
    // Si se encuentra activo el servicio o no
    // asi mismo se muestra como notificacion al agente
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        required: true
    },
    descripTraslado: String,
    //Unidad medica (entidad) a la que fue remitido el paciente
    unidadMedica:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'entidad'
    },
    date: {
        type:Date,
        default: Date.now
    }
})

const AgenRepo = mongoose.model("agenrepo",agenRepoSchema)

module.exports =AgenRepo