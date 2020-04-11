const Contacto = require("../models/contacto")

/* Obtiene contactos del usuario enviado por parametro */
async function buscarContactos(idUsuario){
    var contactos = null

    if(idUsuario){
        contactos = await   Contacto
                            .find({usuario: idUsuario},'_id contacto')
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