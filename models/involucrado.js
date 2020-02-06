const mongoose = require("mongoose")

const involucradoSchema = new mongoose.Schema({
    reporte:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reporte',
        required: true
    },
    tipo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo',
        required: true
    },
    placaqr: {
        type: String,
        required: true
    }
})

const Involucrado = mongoose.model("involucrado",involucradoSchema)

module.exports = Involucrado