//Servicios solicitados por reporte
const mongoose = require("mongoose")

const servicioSchema = new mongoose.Schema({
    reporte:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reporte',
        required: true
    },
    // tipo servicio
    tipo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo',
        required: true
    },
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        required: true
    }
})

const Servicio = mongoose.model('servicio', servicioSchema)

module.exports = Servicio
