//Agentes que atienden el llamado en los reportes
const mongoose = require("mongoose")

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
    detalle:{ 
        type : Array, 
        default : [] 
    },
    descriptraslado: String,
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