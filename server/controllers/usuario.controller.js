const Usuario = require("../models/usuario");
const CorreoCtrl = require("./correo.controller");
const PostageApp = require('postageapp');
const jwt = require('jsonwebtoken');
const usuarioCtrl = {};

const StandarException = require('../exception/StandarException');
const codigos = require('../exception/codigos');

const key = "VSSL";
let id_usuario;

usuarioCtrl.mostrarPagina = async (req, res) => {
    //Validar y decodificar el token
    const token = req.params.token; 
    console.log(token);
    if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado' });
    }
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: 'Token inválido o expirado' });
        }
        id_decodificada = decoded.id; 
    });

    //Validar usuario y mostrar página
    id_usuario = id_decodificada;
    if (id_usuario != undefined && id_usuario != null){
        console.log(id_usuario);
        const usuario = await Usuario.findById(id_usuario); 
        if (usuario){
            const usuario = {confirmado: true};
            await Usuario.findByIdAndUpdate(id_usuario, { $set: usuario }, { new: true });
            res.render("../views/pages/index", { id_usuario });
        } else {
            return new StandarException('Usuario no encontrado', codigos.datosNoEncontrados);
        }
    } else {
        return new StandarException('Usuario no encontrado', codigos.datosNoEncontrados);
    }
}

usuarioCtrl.createUsuario = async (req, res) => {
    const id_generada = generarIds();
    if (id_generada == undefined && id_generada == null){
        return new StandarException('Error al guardar el usuario', codigos.errorAlCrearUsuario, error); 
    }
    console.log(id_generada)
    const usuario = new Usuario({
        id_usuario: id_generada,
        ...req.body
    });
    const savedUsuario = await usuario.save().catch(error => {
        return new StandarException('Error al guardar el usuario', codigos.errorAlCrearUsuario, error);
    });
    console.log(usuario);
    id_usuario = usuario.id_usuario.toString();
    console.log(id_usuario);

    const token = jwt.sign({ id: id_usuario }, key, { expiresIn: '1h' });
    console.log(token);

    const correoEnviado = await usuarioCtrl.enviarCorreo(req, res, token).catch(error => {
        return new StandarException('Error al enviar correo', codigos.errorAlEnviarCorreo, error);
    });
};


usuarioCtrl.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find(); 
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios" });
    }
};

usuarioCtrl.getUsuario = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id); 
    if(!usuario){
        return new StandarException('Usuario no encontrado', codigos.datosNoEncontrados);
    }
    return usuario;
};

usuarioCtrl.editUsuario = async (req, res) => {
    try{
        const { id } = req.params;
        console.log(id);
        const usuario = {
        confirmado: true,
        };
        await Usuario.findByIdAndUpdate(id, { $set: usuario }, { new: true });
        res.json({ status: "Usuario actualizado"  });
    } catch (error) {
        res.status(500).json({ message: 'Usuario no encontrado'});
    }
};

usuarioCtrl.deleteUsuario = async (req, res) => {
    try {
    //await Usuario.findByIdAndRemove(req.params.id); 
        await Usuario.findByIdAndDelete(req.params.id);
        res.json({ status: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

usuarioCtrl.usarIdUsuario = (req, res) => {
    try {
        console.log(`El id_usuario actual es: ${id_usuario}`);
        res.json({ id_usuario });
    } catch (error) {
        res.status(500).json({ message: "Error al usar id_usuario"});
    }
};


usuarioCtrl.enviarCorreo = async (req, res, token) => {
    console.log("Enviando correo");
    console.log({id_usuario});
    if (!id_usuario) {
        return new StandarException('ID de usuario no definido', codigos.validacionIncorrecta);
    }
    console.log("Enviando correo: 1");
    const link = `http://localhost:3000/confirmado/${token}`;
    console.log({link});
    var postageapp = new PostageApp("VkyMBXgOdzGHtUPoRByHdEelTLYmcTBH");
    //const link = `http://localhost:3000/confirmado`;

    var options = {
        recipients: "idbird.upiiz@gmail.com",
        headers: {
            subject: "Prueba 10",
            from: "idbird.upiiz@gmail.com",
        },
        template: "IdBird_child",
        variables: {
            aplicacion: "IdBird",
            nombre: "Ejemplo",
            link: link,
        },
    };
    // Validar estructura del correo
    if (!options.recipients || !options.headers.subject || !options.headers.from || !options.template || !options.variables.link) {
        return new StandarException('Estructura del correo no válida', codigos.validacionIncorrecta);
    }

    const response = await postageapp.sendMessage(options).catch(error => null);
    if (response === null) {
        return new StandarException('Error al enviar el correo', codigos.errorAlEnviarCorreo);
    }
    res.json(response);
};

let counter = 0;
let lastGeneratedHour = "";

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

prueba_id();


module.exports = usuarioCtrl;
