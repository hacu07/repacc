const mongoose = require("mongoose")

const involucradoSchema = new mongoose.Schema({
    reporte:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reporte',
        required: true
    },
    tipo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo'
    },
    placaqr: {
        type: String,
        required: true
    },
    // Usuario involucrado en el reporte
    usuaInvolucrado :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    }
})

const Involucrado = mongoose.model("involucrado",involucradoSchema)

module.exports = Involucrado