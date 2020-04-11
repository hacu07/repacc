const mongoose = require('mongoose')    // para MongoDB
const express = require('express')      // para peticiones
const app = express()

// Routes
const estado = require("./routes/estado")
const rol = require("./routes/rol")
const pais = require("./routes/pais")
const departamento = require("./routes/departamento")
const municipio = require("./routes/municipio")
const usuario = require("./routes/usuario")
const auth = require("./routes/auth")
const solicitud = require("./routes/solicitud")
const contacto = require("./routes/contacto")

//Para usar los datos de tipo JSON -- IMPORTANTE
app.use(express.json());
// Direccionamiento Modelos
app.use('/api/estado/', estado)
app.use('/api/rol/', rol)
app.use('/api/departamento/', departamento)
app.use('/api/pais/', pais)
app.use('/api/municipio/', municipio)
app.use('/api/usuario/', usuario)
app.use('/api/usuario/', auth)
app.use('/api/solicitud/', solicitud)
app.use('/api/contacto/', contacto)

const port = process.env.PORT || 3004

app.listen(port, () => console.log('Escuchando puerto:' +port))

mongoose.connect('mongodb://localhost/repaccdb',{useNewUrlParser:true, useFindAndModify:false, useCreateIndex: true})    
    .then( ()=>console.log('Conectado a MongoDB') )
    .catch( erro => console.log('No se ha conectado a MongoDB') )