const mongoose = require("mongoose")

const vehiculoSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    tipo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo',
        required: true
    },
    esParticular: Boolean,
    modelo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'modelo',
        required: true
    },
    colores:[String],
    placa:{
        unique: true,
        type: String,
        required: true,
        uppercase: true
    },
    foto: String,
    date: {
        type:Date,
        default: Date.now
    }
})

const Vehiculo = mongoose.model("vehiculo", vehiculoSchema)

module.exports = Vehiculo