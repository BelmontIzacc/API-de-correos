const Correo = require('../models/correo');
const PostageApp = require('postageapp');
const jwt = require('jsonwebtoken');
const correoCtrl = {};
//const usuario = require('../controllers/usuario.controller');

//console.log("Correo: ",id_usuario);

/**
 * @description Envia un correo de confirmación
 * @param {*} usuario
 * @param {*} token
 * @returns
*/
correoCtrl.enviarCorreo = async (usuario, token) => {
    console.log("Enviando correo");
    id_usuario = usuario.id_usuario;
    console.log({id_usuario});
    if (!id_usuario) {
        return new StandarException('ID de usuario no definido', codigos.validacionIncorrecta);
    }
    console.log("Enviando correo: 1");
    //https://idbird-api.onrender.com
    const link = `https://idbird-api.onrender.com/confirmado/${token}`;
    console.log({link});
    var postageapp = new PostageApp("VkyMBXgOdzGHtUPoRByHdEelTLYmcTBH");
    //const link = `http://localhost:3000/confirmado`;

    //const destinatario = "idbird.upiiz@gmail.com";
    const destinatario = usuario.correo;
    //valida que destinataio tenga un formato de correo
    if (!destinatario || !esCorreoValido(destinatario)) {
        return new StandarException('Correo no definido o formato incorrecto', codigos.validacionIncorrecta);
    }

    var options = {
        recipients: destinatario,
        headers: {
            subject: "Resgistro en IdBird",
            from: "idbird.upiiz@gmail.com",
        },
        template: "IdBird_child",
        variables: {
            aplicacion: "IdBird",
            nombre: usuario.correo,
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

    return{
        status: true,
        respuesta: response,
        link: link,
        token: token
    };
};

// Función para validar un correo
function esCorreoValido(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

// Manejador para obtener todos los correos
correoCtrl.getCorreos = async (req, res) => {
    try {
        const correos = await Correo.find(); // Busca todos los correos
        res.json(correos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los correos', error });
    }
};

// Manejador para crear un nuevo correo
correoCtrl.createCorreo = async (req, res) => {
    try {
        const correo = new Correo(req.body); // Crea un nuevo correo
        await correo.save();
        console.log(correo);
        res.json({ status: 'Correo guardado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el correo', error });
    }
};

// Manejador para obtener un correo por su ID
correoCtrl.getCorreo = async (req, res) => {
    try {
        const correo = await Correo.findById(req.params.id); // Busca un correo por su ID
        res.json(correo);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el correo', error });
    }
};

// Manejador para editar un correo por su ID
correoCtrl.editCorreo = async (req, res) => {
    try {
        const { id } = req.params; // Edita un correo por su ID
        const correo = await Correo.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ status: 'Correo actualizado', correo });
    } catch (error) {
        res.status(500).json({ message: 'Error al editar el correo', error });
    }
};

correoCtrl.deleteCorreo = async (req, res) => {
    //await Correo.findByIdAndRemove(req.params.id); //Elimina un correo por su ID
    try {
        await Correo.findByIdAndDelete(req.params.id);
        res.json({status: 'Correo eliminado'});
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el correo', error });
    }
};


module.exports = correoCtrl;