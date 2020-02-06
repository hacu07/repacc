const mongoose = require('mongoose')

const marcaSchema = new mongoose.Schema({
    nombre: {
        type:String,
        required: true
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