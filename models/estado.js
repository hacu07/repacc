const mongoose = require("mongoose")

const estadoSchema = new mongoose.Schema({
    codigo:{
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    nombre:{
        type: String,
        required: true,
        uppercase: true,
        unique: true 
    },
    tipo:{
        type: Number,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

// Creacion de la clase modelo ('nombre de la coleccion', schema creado para la coleccion)
const Estado = mongoose.model('estado',estadoSchema)

//  Exporta el modelos para poder ser utilizado
module.exports = Estado