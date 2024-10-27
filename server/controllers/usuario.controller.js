const Usuario = require("../models/usuario");
const CorreoCtrl = require("./correo.controller");
const PostageApp = require('postageapp');
const jwt = require('jsonwebtoken');
const usuarioCtrl = {};

const StandarException = require('../exception/StandarException');
const codigos = require('../exception/codigos');

const key = process.env.TOKEN_KEY;
//let id_usuario;

const token_inicial = jwt.sign({ id: process.env.AUTHENTIFICATION_KEY }, key);
//console.log(process.env.AUTHENTIFICATION_KEY);
//console.log(token_inicial);

/**
 * @description Muestra la página de confirmación de correo
 * @param {*} token 
 * @param {*} res 
 * @returns 
 */
usuarioCtrl.mostrarPagina = async (token, res) => {
    //Validar y decodificar el token
    let id_decodificada;
    console.log(token);
    if (!token) {
        return new StandarException('Token inexistente', codigos.tokenInexistente);
        }
    jwt.verify(token, key, (err, decoded) => {
        console.log(decoded);
        if (err) {
            console.log(err);
            return new StandarException('Token inválido o expirado', codigos.tokenInvalido, err);
        }
        id_decodificada = decoded.id; 
    });

    //Validar usuario y mostrar página
    if (id_decodificada != undefined && id_decodificada != null){
        console.log("Id decodificada:",id_decodificada);
        const usuario = await Usuario.findOne({ id_usuario: id_decodificada }); 
        if (usuario) {
            usuario.confirmado = true; 
            await usuario.save(); 
            return{
                status: true,
                id_decodificada: id_decodificada
            };
        } else {
            return new StandarException('Usuario no encontrado', codigos.datosNoEncontrados);
        }
    } else {
        return new StandarException('Usuario no encontrado', codigos.datosNoEncontrados);
    }
}

/**
 * @description Crea un usuario
 * @param {*} user
 * @param {*} pass
 * @param {*} enviarCorreo
 * @returns
*/
usuarioCtrl.createUsuario = async (id_usuario, user, pass, nombre, apellido) => {   
    //const id_generada = generarIds();
    let usuario;
    //if (id_generada == undefined && id_generada == null){
    //    return new StandarException('Error al guardar el usuario', codigos.errorAlCrearUsuario); 
    //}
    if(!nombre && !apellido){
        usuario = new Usuario({
            id_usuario: id_usuario,
            correo: user,
            contrasena: pass
        });
    }else{
        usuario = new Usuario({
            id_usuario: id_usuario,
            nombre: nombre,
            apellido: apellido,
            correo: user,
            contrasena: pass
        });
    }   
    const savedUsuario = await usuario.save().catch(error => {
        return new StandarException('Error al guardar el usuario', codigos.errorAlCrearUsuario, error);
    });
    //console.log(usuario);
    id_usuario = usuario.id_usuario.toString();
    //console.log(id_usuario);
    //validar el usuario
    const token = jwt.sign({ id: id_usuario }, key, { expiresIn: '8h' });
    //console.log(token);
    return{
        status: true,
        usuario: usuario,
        token: token
    };
};


let counter = 0;
let lastGeneratedHour = "";

//Genera un id único
const generarIds = () => {
    const prefix = '107';
    const date = new Date();
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses en JavaScript van de 0 a 11
    const year = String(date.getFullYear());
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const currentHour = `${day}${month}${year}${hour}${minutes}`;
    
    if (currentHour !== lastGeneratedHour) {
        counter = 1;
        lastGeneratedHour = currentHour;
    } else {
        counter += 1;
    }
    
    const counterStr = String(counter).padStart(2, '0');
    
    return `${prefix}${day}${month}${year}${hour}${minutes}${counterStr}`;
};

/**
 * @description Obtiene todos los usuarios
 * @returns
*/
usuarioCtrl.getUsuarios = async () => {
    try {
        const usuarios = await Usuario.find(); 
        return usuarios;
    } catch (error) {
        return new StandarException('Usuarios no encontrados', codigos.datosNoEncontrados, error);
    }
};

/**
 * @description Obtiene un usuario
 * @param {*} id
 * @returns
*/
usuarioCtrl.getUsuario = async (id) => {
    try{
        let usuario;
        console.log(id);
        //console.log(id.length);
        if (id.length != 17) {
            usuario = await Usuario.findById(id); 
        }else{
            usuario = await Usuario.findOne({ id_usuario: id });
        }
        if(!usuario){
            return new StandarException('Usuario no encontrado', codigos.datoNoEncontrado);
        }
        return usuario;
    } catch (error) {
        return new StandarException('Usuario no encontrado', codigos.datoNoEncontrado, error);
    }    
};

/**
 * @description Edita un usuario
 * @param {*} id
 * @param {*} usuario
 * @returns
*/
usuarioCtrl.editUsuario = async (id, usuario) => {
    try{
        console.log(id);
        console.log(usuario);
        const usuarioNuevo = {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            contrasena: usuario.contrasena
        };
        if (id.length != 17) {
            await Usuario.findByIdAndUpdate(id, { $set: usuarioNuevo }, { new: true });
        }else{
            await Usuario.findOneAndUpdate({ id_usuario: id }, { $set: usuarioNuevo }, { new: true });
        }
        return usuarioNuevo;
    } catch (error) {
        return new StandarException('Usuario no encontrado', codigos.datoNoEncontrado);
    }
};

/**
 * @description Elimina un usuario
 * @param {*} id
 * @returns
*/
usuarioCtrl.deleteUsuario = async (id) => {
    try {
    //await Usuario.findByIdAndRemove(req.params.id); 
    //await Usuario.findByIdAndDelete(id);
        console.log(id);
        if (id.length != 17) {
            await Usuario.findByIdAndDelete(id);
        }
        else{
            await Usuario.findOneAndDelete({ id_usuario: id });
        }
        return { status: "Usuario eliminado" };
    } catch (error) {
        return new StandarException('Usuario no encontrado', codigos.datoNoEncontrado);
    }
};

/**
usuarioCtrl.usarIdUsuario = (req, res) => {
    try {
        console.log(`El id_usuario actual es: ${id_usuario}`);
        res.json({ id_usuario });
    } catch (error) {
        res.status(500).json({ message: "Error al usar id_usuario"});
    }
};



//comprueba que cada id sea único
prueba_id = () => {
    const ids = [];
    for (let i = 0; i < 500; i++) {
        ids.push(generarIds());
    }
    //console.log(ids);
    const uniqueIds = new Set(ids);
    console.log(uniqueIds.size === ids.length);
}

prueba_id();*/


module.exports = usuarioCtrl;
