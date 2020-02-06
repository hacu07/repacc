const mongoose = require("mongoose")

const modeloSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required: true
    }, 
    marca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'marca',
        required:true
    },
    estado :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }    
})

const Modelo = mongoose.model('modelo', modeloSchema)

module.exports = Modelo