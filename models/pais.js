const mongoose = require('mongoose')

const paisSchema = new mongoose.Schema({
    codigo:{
        type: Number,
        required: true
    },
    nombre:{
        type: String,
        required: true
    },
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado'
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const Pais = mongoose.model('pais',paisSchema)

module.exports =  Pais