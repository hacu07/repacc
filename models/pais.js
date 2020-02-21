const mongoose = require('mongoose')

const paisSchema = new mongoose.Schema({
    codigo:{
        type: String,
        required: true
    },
    prefijoTel:{
        type: String,
        required: true
    },
    nombre:{
        type: String,
        required: true,
        uppercase: true
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