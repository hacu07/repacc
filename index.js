const mongoose = require('mongoose')    // para MongoDB
const express = require('express')      // para peticiones
const app = express()

// Routes
const estado = require("./routes/estado")
const rol = require("./routes/rol")

//Para usar los datos de tipo JSON -- IMPORTANTE
app.use(express.json());
// Direccionamiento Modelos
app.use('/api/estado/', estado)
app.use('/api/rol/', rol)

const port = process.env.PORT || 3004

app.listen(port, () => console.log('Escuchando puerto:' +port))

mongoose.connect('mongodb://localhost/repaccdb',{useNewUrlParser:true, useFindAndModify:false, useCreateIndex: true})    
    .then( ()=>console.log('Conectado a MongoDB') )
    .catch( erro => console.log('No se ha conectado a MongoDB') )