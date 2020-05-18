const mongoose = require("mongoose")

const entidadSchema = new mongoose.Schema({
    nit:{
        type: String,
        required: true
    },
    nombre:{
        type: String,
        required: true
    },
    direccion:{
        type:String,
        required: true
    },
    municipio:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipio',
        required: true
    },
    latlong: {
        type: String,
        required: true
    },
    latitud: Number,
    longitud: Number,
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        required: true
    },
    // usuario que registro la entidad
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    // tipo de entidad [EPS,ESTADO,ETC.]
    tipo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo',
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Entidad = mongoose.model('entidad', entidadSchema)

module.exports = Entidad
