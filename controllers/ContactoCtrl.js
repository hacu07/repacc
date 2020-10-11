const Contacto = require("../models/contacto")
const Usuario = require("../models/usuario")
const EstadoCtrl = require("./EstadoCtrl.js")
const SolicitudCtrl = require("../controllers/SolicitudCtrl")
const Util = require("./Util.js")
/*
    Busca usuarios a agregar como contacto segun el username
    retorna lista de contactos que se asemejan al username enviado
*/
async function findContacts(userId, username){
    let usuarios = null

    //Obtiene estado de usuarios validos
    const estado = await EstadoCtrl.buscarEstado(Util.ESTADO_CODIGO_ACTIVO)

    if(estado != null){
        usuarios = await Usuario.find({usuario: eval("/"+username+"/"), estado: estado._id},"_id nombre usuario foto")

        // elimina usuarios que han sido aceptados 
        // como contactos por el usuario que realiza la solicitud
        if(usuarios.length > 0){
            usuarios = await filtrarContactosAgregados(userId, usuarios)
            usuarios = await filtrarSegunSolicitudes(userId, usuarios)
        }
    }

    return usuarios
}


/*****************************************************
 * Filtra los usuarios a mostrar eliminando a los que ya se encuentran
 * en proceso de solicitud
 */
async function filtrarSegunSolicitudes(userId, usuarios){
    let usuariosAMostrar = usuarios
    
    if(usuariosAMostrar != null){
        if(usuariosAMostrar.length > 0){
            let solicitudes = await SolicitudCtrl.obtenerSolicitudesPorUsuario(userId)
            if(solicitudes != null){
                for (let i = 0; i < solicitudes.length; i++) {
                    const solicitud = solicitudes[i];
                    
                    // Si el usuario a mostrar se encuentra en una solicitud con 
                    // el usuario que realizo la busqueda se elimina de la lista
                    // de usuarios a mostrar
                    usuariosAMostrar = usuariosAMostrar.filter( 
                        usuario =>  {                        
                        return (
                            !(usuario._id.equals(solicitud.usuario)) && 
                            !(usuario._id.equals(solicitud.contacto))
                        )}            
                    )
                }
            }
        }
    }

    return usuariosAMostrar
}

/****************************************************
 * Filtra de los usuarios a buscar los contactos ya registrados
 * para que solo aparezcan los que no se tienen agregados
 */
async function filtrarContactosAgregados(userId, usuarios){
    let usuariosAMostrar = usuarios

    if(usuariosAMostrar != null){
        if(usuariosAMostrar.length > 0){
            let contactosAgregados = await buscarContactos(userId)

            if(contactosAgregados != null){
                if(contactosAgregados.length > 0){
                    // recorre cada usuario de la busqueda y verifica que no se encuentre entre los contactos
                    for (let i = 0; i < contactosAgregados.length; i++) {
                        let contactoAgregado = contactosAgregados[i];
                        // filtra los contactos
                        // si se encuentra entre los usuarios a mostrar lo elimina
                        usuariosAMostrar = usuariosAMostrar.filter(usuario => {
                            return !usuario._id.equals(contactoAgregado.contacto._id)
                        })
                    }
                }
            }
        }
    }

    return usuariosAMostrar
}

/* Obtiene contactos del usuario enviado por parametro */
async function buscarContactos(idUsuario){
    var contactos = null    

    if(idUsuario){
        contactos = 
        await  Contacto.find({usuario: idUsuario},'_id contacto')
            .populate(
                {
                    path: 'contacto',
                    select : '_id nombre usuario foto tipoSangre'                                    
                }
            )
    }

    return contactos
}

/* Registra contacto a un usuario, retornar obj contacto*/
async function registrar(usuEnviaSol, usuAceptaSol){
    let contactoRegistrado = null

    if(usuEnviaSol && usuAceptaSol){
        // registra el contacto en el usuario
        const promise1 = new Promise(async (resolve, reject)=>{
            // crea objeto a guardar
            const contacto = new Contacto({
                usuario: usuAceptaSol,
                contacto: usuEnviaSol
            })
            // registra el contacto
            const contactRegi = await contacto.save()            

            // Retorna objecto almacenado
            resolve(contactRegi)
        })

        // registra usuario en el contacto
        const promise2 = new Promise(async (resolve, reject)=>{
            // crea objeto a guardar
            const contacto = new Contacto({
                usuario: usuEnviaSol,
                contacto: usuAceptaSol
            })
            // registra el contacto
            const contactRegi = await contacto.save()
            // Retorna objeto almacenado
            resolve(contactRegi)
        })

        // Ejecuta las promise
        contactoRegistrado = Promise.race([promise1,promise2])
        .then(result => {
            return Contacto.findById(result._id, '_id contacto').populate(
                {
                    path: 'contacto',
                    select : '_id nombre usuario foto tipoSangre'                                    
                }
            )
        })
        .catch(err => {
            return null
        })
    }

    return contactoRegistrado
}

exports.buscarContactos = buscarContactos
exports.registrar = registrar
exports.findContacts = findContacts