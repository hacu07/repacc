const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const usuarioSchema = new mongoose.Schema({
    qr:{
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    correo:{
        type: String,
        required: true,
        unique: true
    },
    nombre:{
        type: String,
        required: true,
        uppercase: true
    },
    contrasena:{
        type: String,
        required: true
    },
    celular:{
        type: String,
        required: true
    },
    usuario:{
        type: String,
        minlength: 4,
        maxlength: 16,
        required: true,
        unique: true
    },    
    codRecuCon:{
        type: String,
        minlength: 6,
        maxlength: 8,
        default: null
    },
    date:{
        type: Date, 
        default: Date.now
    },
    rol:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rol',
        required: true
    },
    foto: String,
    tipoSangre:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo'
    },
    munNotif:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipio'
    },
    recibirNotif:{
        type:Boolean,
        default: true
    },
    munResid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'municipio'
    },
    estado:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'estado',
        required: true
    }
})

// Se crea una variable de entorno para almacenar la 'semilla'
/*
    1. abrir consola y escribir comando: export 'NOMBRE_VARIABLE_ENTORNO'='VALOR_VARIABLE'
      ej: export KEY_JWT_REPACC_API=1234 (sin espacios al dar =, en consola tipo bash)
        si es windows cmd cambiar export por set
*/

// Funcion para JWT
usuarioSchema.methods.generateJWT = function(){
    return jwtToken = jwt.sign({
        _id: this._id,
        nombre: this.nombre,
        rol: this.rol,
        estado: this.estado
    }, process.env.KEY_JWT_REPACC_API)
}

const Usuario = mongoose.model("usuario", usuarioSchema)

module.exports = Usuario