// Valida que el token obtenido del cliente es correcto
const jwt = require('jsonwebtoken')

function auth(req,res,next){
    // obtiene token enviado por el cliente
    const jwtToken = req.header('Authorization')
    // si no lo envio...
    if(!jwtToken) return res.status(401).json({error: true, msj: 'Acceso denegado. No token.'})

    try{
        // verifica el token (ingresa semilla como segundo parametro almacenada en variable de entorno)
        const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_JWT_CAR_API)

        req.payload = payload
        next() // llama al siguiente middleaware
    }catch(e){
        res.status(400).json({error: true, msj: 'Acceso denegado. Token no valido.'})
    }
}

module.exports = auth