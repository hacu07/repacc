const mongoose = require('mongoose')    // para MongoDB
const mSocket  = require("./socket.js/socket")   // Socket

const {app, express} = require('./app/app')

//Para usar los datos de tipo JSON -- IMPORTANTE
app.use(express.json());

const port = process.env.PORT || 3004
const server = app.listen(port, () => console.log('Escuchando puerto:' +port))

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
const vehiculo = require("./routes/vehiculo")
const marca = require("./routes/marca")
const modelo = require("./routes/modelo")
const tipo = require("./routes/tipo")
const reporte = require("./routes/reporte")
const servicio = require("./routes/servicio")
const entidad = require("./routes/entidad")
const agente = require("./routes/agente")
const notificacion = require("./routes/notificacion")


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
app.use('/api/vehiculo/', vehiculo)
app.use('/api/marca/', marca)
app.use('/api/modelo/', modelo)
app.use('/api/tipo/', tipo)
app.use('/api/reporte/', reporte)
app.use('/api/servicio/', servicio)
app.use('/api/entidad/', entidad)
app.use('/api/agente/', agente)
app.use('/api/notificacion/', notificacion)

const SocketIO = require('socket.io')
const io = SocketIO.listen(server)

mongoose.connect('mongodb://localhost/repaccdb',{useNewUrlParser:true, useFindAndModify:false, useCreateIndex: true})    
    .then( ()=>{
        console.log('Conectado a MongoDB')
        // Si se conectó a mongoDB asigna el socket 
        mSocket.socket(io,app)
    })
    .catch( 
        error => console.log('No se logró conectar a MongoDB')
    )

    