/*****************************************************
 * Archivo encargado de gestionar el uso de los sockets
 * HAROLDC 23/08/2020
 */
const UsuarioCtrl = require("../controllers/UsuarioCtrl")

// Obtiene el socket y lo configura
exports.socket = (io, app) =>{

    io.on('connection', (socket) => {    
        // Cuando alguien se conecta, asigna el socket                    
        console.log('new conection: ' + socket.id)

        app.set('socket',socket)
            

        socket.on('newConnection', (obj)=>{
            console.log("Capturada nueva conexión: " + obj.socketId)
        })

        // Retorna al usuario ID de socket
        socket.emit('newConnection', {            
            socketId: socket.id
        })
        
        // Usuario se ha desconectado
        socket.on('disconnect', async () => {
            await UsuarioCtrl.updateSocketId(
                {socketId: socket.id},
                2
            )
            console.log("Se ha desconectado un usuario. " + socket.id)
        })
    })
}