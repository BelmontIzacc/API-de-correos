const Correo = require('../models/correo');
const PostageApp = require('postageapp');
const correoCtrl = {};
//const usuario = require('../controllers/usuario.controller');

//console.log("Correo: ",id_usuario);

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

/*
var postageapp = new PostageApp('VkyMBXgOdzGHtUPoRByHdEelTLYmcTBH');
const link = `http://localhost:3000/${id_usuario}`;

var options = {
    recipients: "idbird.upiiz@gmail.com",  
    headers: {
      subject: "Prueba 7",
      from: "idbird.upiiz@gmail.com"
    }, 
    "template" : "IdBird_child",
    variables: {
        'aplicacion' : "IdBird",
        'nombre' : "Ejemplo",
        'link' : link
    }
}*/
/*
postageapp.sendMessage(options).then((response) => {
    console.log(response);
}).catch((error) => {
  console.error(error);
});*/

/*postageapp.message_delivery_status('b5b8e130-8e38-4b95-8f75-96492d43b86c').then(() => {
    console.log(response);
})

postageapp.messages_history().then((response) => {
    console.log(response);
}).catch((error) => {
  console.error(error);
});

postageapp.message_delivery_status({uid: 'f0b20136-2fba-42ba-9c74-10c9cb6e2ed7'}).then((response) => {
    console.log(response);
}).catch((error) => {
    console.error(error);
});*/
/*
correoCtrl.enviarCorreo = async (req, res) => {
    //const link = `http://localhost:3000/${id_usuario}`;
    console.log(id_usuario);
    postageapp.sendMessage(options).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.json(error);
    });
};*/


module.exports = correoCtrl;