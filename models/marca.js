const mongoose = require('mongoose')

const marcaSchema = new mongoose.Schema({
    tipo:{
        type: mongoose.Schema.Types.ObjectId, // objeto id del documento 'tipo'
        ref: 'tipo', // referencia a la coleccion del id (debe ser igual a como se llamo en el modelo)
        required : true
    },
    nombre: {
        type:String,
        required: true,
        unique: true,
        uppercase: true
    },estado:{
        type: mongoose.Schema.Types.ObjectId, // objeto id del documento 'estado'
        ref: 'estado', // referencia a la coleccion del id (debe ser igual a como se llamo en el modelo)
        required : true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Marca = mongoose.model('marca',marcaSchema)

module.exports = Marca